'use client'

import { useEffect, useRef, useState } from 'react'

type AmbientVideoProps = {
  src: string
  poster: string
  forcePoster?: boolean
}

type NavigatorWithConnection = Navigator & {
  connection?: { saveData?: boolean }
}

export default function AmbientVideo({ src, poster, forcePoster = false }: AmbientVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [canRenderVideo, setCanRenderVideo] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const desktopViewport = window.matchMedia('(min-width: 768px)')
    const saveData = (navigator as NavigatorWithConnection).connection?.saveData === true

    const updateEligibility = () => {
      setCanRenderVideo(!forcePoster && !reducedMotion.matches && desktopViewport.matches && !saveData)
    }

    updateEligibility()
    reducedMotion.addEventListener('change', updateEligibility)
    desktopViewport.addEventListener('change', updateEligibility)

    return () => {
      reducedMotion.removeEventListener('change', updateEligibility)
      desktopViewport.removeEventListener('change', updateEligibility)
    }
  }, [forcePoster])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !canRenderVideo || videoFailed) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => undefined)
        } else {
          video.pause()
        }
      },
      { threshold: 0.15 },
    )

    observer.observe(video)
    return () => {
      observer.disconnect()
      video.pause()
    }
  }, [canRenderVideo, videoFailed])

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster}
        alt=""
        width={1360}
        height={768}
        loading="eager"
        decoding="async"
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {canRenderVideo && !videoFailed && (
        <video
          ref={videoRef}
          src={src}
          className="absolute inset-0 h-full w-full object-cover"
          muted
          playsInline
          loop
          preload="metadata"
          aria-hidden="true"
          disablePictureInPicture
          onError={() => setVideoFailed(true)}
        />
      )}
    </>
  )
}
