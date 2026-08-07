'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'

interface SceneLayerProps {
  poster: string
  video: string
  overlay?: number
}

export default function SceneLayer({ poster, video, overlay = 0.28 }: SceneLayerProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [allowVideo, setAllowVideo] = useState(false)
  const [failed, setFailed] = useState(false)

  // SSR-safe capability check: no motion video on reduced motion, data saver or small screens.
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    const narrow = window.innerWidth < 768
    if (!reduceMotion && !connection?.saveData && !narrow) setAllowVideo(true)
  }, [])

  // Play only while the scene is on screen.
  useEffect(() => {
    const node = wrapRef.current
    if (!allowVideo || failed || !node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const element = videoRef.current
        if (!element) return
        if (entry.isIntersecting) element.play().catch(() => {})
        else element.pause()
      },
      { threshold: 0.15 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [allowVideo, failed])

  return (
    <div ref={wrapRef} aria-hidden="true" className="absolute inset-0 overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster || '/placeholder.svg'}
        alt=""
        width={1920}
        height={1080}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {allowVideo && !failed && (
        <video
          ref={videoRef}
          src={video}
          poster={poster}
          muted
          playsInline
          loop
          preload="metadata"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(250, 247, 242, var(--scene-overlay))', '--scene-overlay': overlay } as CSSProperties}
      />
    </div>
  )
}
