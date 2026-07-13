'use client'

import { motion, useReducedMotion } from 'framer-motion'
import ChartKicker from './ChartKicker'

export default function RouteTransition() {
  const reduceMotion = useReducedMotion()

  return (
    <section id="ruta" className="flex min-h-[70vh] items-center bg-[var(--bg)] py-[8vh]">
      <div className="site-container flex w-full flex-col items-center">
        <div className="w-full max-w-3xl">
          <ChartKicker bearing="02" label="Ruta e trasată." />
        </div>
        <motion.img
          data-route-origin="true"
          src="/images/mast-rose.png"
          alt=""
          aria-hidden="true"
          className="mt-8 h-auto w-[200px] md:w-[280px]"
          initial={reduceMotion ? false : { opacity: 0, rotate: -140, scale: 0.9 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, rotate: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 60, damping: 9 }}
        />
      </div>
    </section>
  )
}
