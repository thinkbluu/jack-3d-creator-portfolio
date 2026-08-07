'use client'

import { useEffect, useRef, useState } from 'react'
import type { MotionValue } from 'framer-motion'

type Clip = { src: string; poster?: string }

type ScrubStageProps = {
  clips: Clip[]
  progress: MotionValue<number>
  className?: string
}

const FRAMES_PER_CLIP = 72
const MAX_FRAME_WIDTH = 1280
const SMOOTH_FACTOR = 0.12
const SNAP_EPSILON = 0.0005
const SEEK_EPSILON = 0.04

function clamp01(value: number) {
  return value < 0 ? 0 : value > 1 ? 1 : value
}

function once(el: HTMLVideoElement, event: string, timeoutMs = 8000) {
  return new Promise<void>((resolve, reject) => {
    let settled = false
    const cleanup = () => {
      el.removeEventListener(event, onEvent)
      el.removeEventListener('error', onError)
      window.clearTimeout(timer)
    }
    const onEvent = () => {
      if (settled) return
      settled = true
      cleanup()
      resolve()
    }
    const onError = () => {
      if (settled) return
      settled = true
      cleanup()
      reject(new Error('media error'))
    }
    const timer = window.setTimeout(() => {
      if (settled) return
      settled = true
      cleanup()
      reject(new Error('media timeout'))
    }, timeoutMs)
    el.addEventListener(event, onEvent)
    el.addEventListener('error', onError)
  })
}

function nearestFrame(frames: Array<ImageBitmap | null>, index: number) {
  if (frames[index]) return frames[index]
  for (let offset = 1; offset < frames.length; offset += 1) {
    const before = frames[index - offset]
    if (before) return before
    const after = frames[index + offset]
    if (after) return after
  }
  return null
}

export default function ScrubStage({ clips, progress, className }: ScrubStageProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const posterRef = useRef<HTMLImageElement | null>(null)
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([])
  const framesRef = useRef<Array<Array<ImageBitmap | null>>>([])
  const clipReadyRef = useRef<boolean[]>([])
  const smoothedRef = useRef(0)
  const lastDrawnRef = useRef({ clip: -1, frame: -1 })
  const revealedRef = useRef(false)
  const fallbackRef = useRef(false)
  const [fallback, setFallback] = useState(false)

  // Frame extraction: sequential, first clip prioritised, never blocks the main thread for long.
  useEffect(() => {
    let cancelled = false
    framesRef.current = clips.map(() => new Array<ImageBitmap | null>(FRAMES_PER_CLIP).fill(null))
    clipReadyRef.current = clips.map(() => false)

    const enterFallback = () => {
      if (cancelled) return
      fallbackRef.current = true
      setFallback(true)
      const poster = posterRef.current
      const canvas = canvasRef.current
      if (canvas) canvas.style.opacity = '0'
      if (poster) poster.style.opacity = '0'
    }

    const reveal = () => {
      if (revealedRef.current || cancelled) return
      revealedRef.current = true
      const canvas = canvasRef.current
      const poster = posterRef.current
      if (canvas) canvas.style.opacity = '1'
      if (poster) poster.style.opacity = '0'
    }

    async function extractClip(clipIndex: number) {
      const video = videoRefs.current[clipIndex]
      if (!video) throw new Error('missing video element')
      if (video.readyState < 2) await once(video, 'loadeddata')
      const duration = video.duration
      if (!Number.isFinite(duration) || duration <= 0) throw new Error('invalid duration')

      const scratch = document.createElement('canvas')
      const scratchCtx = scratch.getContext('2d')
      if (!scratchCtx) throw new Error('no 2d context')
      const nativeWidth = video.videoWidth || MAX_FRAME_WIDTH
      const nativeHeight = video.videoHeight || Math.round(MAX_FRAME_WIDTH * 0.5625)
      const scale = Math.min(1, MAX_FRAME_WIDTH / nativeWidth)
      scratch.width = Math.max(1, Math.round(nativeWidth * scale))
      scratch.height = Math.max(1, Math.round(nativeHeight * scale))

      for (let i = 0; i < FRAMES_PER_CLIP; i += 1) {
        if (cancelled) return
        const target = (i / (FRAMES_PER_CLIP - 1)) * Math.max(0, duration - 0.05)
        video.currentTime = target
        await once(video, 'seeked')
        if (cancelled) return
        scratchCtx.drawImage(video, 0, 0, scratch.width, scratch.height)
        const bitmap = await createImageBitmap(scratch)
        if (cancelled) {
          bitmap.close()
          return
        }
        framesRef.current[clipIndex][i] = bitmap
        if (clipIndex === 0 && i === 0) reveal()
        await new Promise((resolve) => setTimeout(resolve, 0))
      }
      clipReadyRef.current[clipIndex] = true
    }

    async function run() {
      if (typeof createImageBitmap !== 'function') {
        enterFallback()
        return
      }
      try {
        for (let clipIndex = 0; clipIndex < clips.length; clipIndex += 1) {
          if (cancelled) return
          await extractClip(clipIndex)
        }
      } catch {
        enterFallback()
      }
    }

    run()

    return () => {
      cancelled = true
      framesRef.current.forEach((frames) => {
        frames.forEach((frame) => frame?.close())
      })
      framesRef.current = []
    }
  }, [clips])

  // Canvas sizing with DPR cap, debounced resize, forced redraw.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let timer: number | undefined

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const width = Math.max(1, Math.round(canvas.clientWidth * dpr))
      const height = Math.max(1, Math.round(canvas.clientHeight * dpr))
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
      }
      lastDrawnRef.current = { clip: -1, frame: -1 }
    }

    const onResize = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(resize, 200)
    }

    resize()
    window.addEventListener('resize', onResize)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  // Single persistent rAF: smoothing, mapping, drawing. No React state touched here.
  useEffect(() => {
    let raf = 0

    const tick = () => {
      raf = window.requestAnimationFrame(tick)
      const target = clamp01(progress.get())
      const diff = target - smoothedRef.current
      smoothedRef.current = Math.abs(diff) < SNAP_EPSILON ? target : smoothedRef.current + diff * SMOOTH_FACTOR
      const smoothed = smoothedRef.current

      const clipIndex = smoothed < 0.5 ? 0 : 1
      const localProgress = clamp01(clipIndex === 0 ? smoothed / 0.5 : (smoothed - 0.5) / 0.5)

      if (fallbackRef.current) {
        videoRefs.current.forEach((video, index) => {
          if (!video) return
          const visible = index === clipIndex
          const nextOpacity = visible ? '1' : '0'
          if (video.style.opacity !== nextOpacity) video.style.opacity = nextOpacity
          if (!visible || !Number.isFinite(video.duration) || video.duration <= 0) return
          const seekTo = localProgress * Math.max(0, video.duration - 0.05)
          if (Math.abs(video.currentTime - seekTo) > SEEK_EPSILON) video.currentTime = seekTo
        })
        return
      }

      const frames = framesRef.current[clipIndex]
      if (!frames) return
      const frameIndex = Math.round(localProgress * (FRAMES_PER_CLIP - 1))
      if (lastDrawnRef.current.clip === clipIndex && lastDrawnRef.current.frame === frameIndex) return

      const bitmap = nearestFrame(frames, frameIndex)
      if (!bitmap) return
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      if (!canvas || !ctx) return

      const scale = Math.max(canvas.width / bitmap.width, canvas.height / bitmap.height)
      const drawWidth = bitmap.width * scale
      const drawHeight = bitmap.height * scale
      ctx.drawImage(bitmap, (canvas.width - drawWidth) / 2, (canvas.height - drawHeight) / 2, drawWidth, drawHeight)
      lastDrawnRef.current = { clip: clipIndex, frame: frameIndex }
    }

    raf = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(raf)
  }, [progress])

  const activePoster = clips[0]?.poster

  return (
    <div aria-hidden="true" className={`absolute inset-0 overflow-hidden ${className ?? ''}`}>
      {activePoster && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={posterRef}
          src={activePoster}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[400ms] ease-out"
          style={{ opacity: 1 }}
        />
      )}

      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full transition-opacity duration-[400ms] ease-out" style={{ opacity: 0 }} />

      {clips.map((clip, index) => (
        <video
          key={clip.src}
          ref={(node) => {
            videoRefs.current[index] = node
          }}
          src={clip.src}
          poster={clip.poster}
          muted
          playsInline
          preload="auto"
          crossOrigin="anonymous"
          className={fallback ? 'absolute inset-0 h-full w-full object-cover' : 'hidden'}
          style={fallback ? { opacity: index === 0 ? 1 : 0 } : undefined}
        />
      ))}
    </div>
  )
}
