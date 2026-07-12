'use client'

import { useRef } from 'react'
import { useScroll, useTransform, motion, MotionValue } from 'framer-motion'

interface AnimatedCharProps {
  char: string
  progress: MotionValue<number>
  index: number
  total: number
}

function AnimatedChar({ char, progress, index, total }: AnimatedCharProps) {
  const opacity = useTransform(progress, [index / total, (index + 1) / total], [0.2, 1])
  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <span style={{ opacity: 0 }}>{char === ' ' ? '\u00A0' : char}</span>
      <motion.span style={{ opacity, position: 'absolute', left: 0, top: 0 }}>
        {char === ' ' ? '\u00A0' : char}
      </motion.span>
    </span>
  )
}

interface AnimatedTextProps {
  text: string
  className?: string
  style?: React.CSSProperties
}

export default function AnimatedText({ text, className, style }: AnimatedTextProps) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  })

  const chars = text.split('').map((char, index) => ({
    char,
    id: `${char}-${text.slice(0, index).split(char).length}`,
  }))

  return (
    <p ref={ref} className={className} style={style}>
      {chars.map(({ char, id }, index) => (
        <AnimatedChar key={id} char={char} progress={scrollYProgress} index={index} total={chars.length} />
      ))}
    </p>
  )
}
