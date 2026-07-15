'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

type ChartMarksProps = {
  variant: 'a' | 'b'
}

type Mark =
  | { type: 'depth'; value: string; left: string; top: string; drift: number }
  | { type: 'tick'; left: string; top: string; drift: number }
  | { type: 'star'; left: string; top: string; drift: number }

const marks: Record<ChartMarksProps['variant'], Mark[]> = {
  a: [
    { type: 'depth', value: '12', left: '7%', top: '15%', drift: -18 },
    { type: 'depth', value: '9,4', left: '17%', top: '37%', drift: -31 },
    { type: 'depth', value: '17', left: '4%', top: '68%', drift: -44 },
    { type: 'depth', value: '21', left: '84%', top: '22%', drift: -25 },
    { type: 'depth', value: '7,6', left: '94%', top: '72%', drift: -55 },
    { type: 'tick', left: '12%', top: '82%', drift: -37 },
    { type: 'tick', left: '80%', top: '48%', drift: -21 },
    { type: 'tick', left: '91%', top: '11%', drift: -48 },
    { type: 'star', left: '19%', top: '57%', drift: -29 },
  ],
  b: [
    { type: 'depth', value: '14', left: '5%', top: '24%', drift: -27 },
    { type: 'depth', value: '8,2', left: '18%', top: '53%', drift: -51 },
    { type: 'depth', value: '19', left: '9%', top: '88%', drift: -35 },
    { type: 'depth', value: '23', left: '81%', top: '14%', drift: -19 },
    { type: 'depth', value: '6,8', left: '93%', top: '61%', drift: -46 },
    { type: 'tick', left: '15%', top: '10%', drift: -42 },
    { type: 'tick', left: '86%', top: '39%', drift: -32 },
    { type: 'tick', left: '96%', top: '84%', drift: -54 },
    { type: 'star', left: '79%', top: '74%', drift: -24 },
  ],
}

export default function ChartMarks({ variant }: ChartMarksProps) {
  const layerRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: layerRef, offset: ['start end', 'end start'] })

  return (
    <div ref={layerRef} aria-hidden="true" className="pointer-events-none absolute inset-0 hidden overflow-hidden md:block">
      {marks[variant].map((mark, index) => (
        <ChartMark key={`${variant}-${index}`} mark={mark} progress={scrollYProgress} isStatic={Boolean(reduceMotion)} />
      ))}
    </div>
  )
}

function ChartMark({ mark, progress, isStatic }: { mark: Mark; progress: ReturnType<typeof useScroll>['scrollYProgress']; isStatic: boolean }) {
  const y = useTransform(progress, [0, 1], [0, mark.drift])
  return (
    <motion.span className="absolute" style={{ left: mark.left, top: mark.top, y: isStatic ? 0 : y }}>
      {mark.type === 'depth' ? (
        <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-[rgba(245,241,232,0.14)]">{mark.value}</span>
      ) : mark.type === 'tick' ? (
        <span className="relative block h-2.5 w-2.5 text-[rgba(201,162,39,0.10)] before:absolute before:left-1/2 before:top-0 before:h-2.5 before:w-px before:-translate-x-1/2 before:bg-current after:absolute after:left-0 after:top-1/2 after:h-px after:w-2.5 after:-translate-y-1/2 after:bg-current" />
      ) : (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-[rgba(201,162,39,0.08)]">
          <path d="M7 1.5C7.4 5.2 8.8 6.6 12.5 7C8.8 7.4 7.4 8.8 7 12.5C6.6 8.8 5.2 7.4 1.5 7C5.2 6.6 6.6 5.2 7 1.5Z" stroke="currentColor" strokeWidth="1" />
        </svg>
      )}
    </motion.span>
  )
}
