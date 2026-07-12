'use client'

import { useRef, useState, useCallback, ReactNode } from 'react'

interface MagnetProps {
  children: ReactNode
  padding?: number
  strength?: number
  activeTransition?: string
  inactiveTransition?: string
  className?: string
}

export default function Magnet({
  children,
  padding = 150,
  strength = 3,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.6s ease-in-out',
  className,
}: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)
  const [transform, setTransform] = useState('translate3d(0,0,0)')

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const distX = e.clientX - centerX
      const distY = e.clientY - centerY

      // Check if within padding
      const inBounds =
        e.clientX > rect.left - padding &&
        e.clientX < rect.right + padding &&
        e.clientY > rect.top - padding &&
        e.clientY < rect.bottom + padding

      if (inBounds) {
        const rotateX = Math.max(-6, Math.min(6, (-distY / Math.max(rect.height, 1)) * 12))
        const rotateY = Math.max(-6, Math.min(6, (distX / Math.max(rect.width, 1)) * 12))
        setActive(true)
        setTransform(`perspective(900px) translate3d(${distX / strength}px, ${distY / strength}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`)
      } else {
        setActive(false)
        setTransform('translate3d(0,0,0)')
      }
    },
    [padding, strength]
  )

  const handleMouseLeave = useCallback(() => {
    setActive(false)
    setTransform('translate3d(0,0,0)')
  }, [])

  const attachListeners = useCallback(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)
  }, [handleMouseMove, handleMouseLeave])

  const detachListeners = useCallback(() => {
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseleave', handleMouseLeave)
  }, [handleMouseMove, handleMouseLeave])

  return (
    <div
      ref={ref}
      className={className}
      onMouseEnter={attachListeners}
      onMouseLeave={() => {
        detachListeners()
        setActive(false)
        setTransform('translate3d(0,0,0)')
      }}
      style={{
        transform,
        transition: active ? activeTransition : inactiveTransition,
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  )
}
