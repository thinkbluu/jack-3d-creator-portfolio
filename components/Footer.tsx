'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

const bucharestClock = new Intl.DateTimeFormat('ro-RO', {
  timeZone: 'Europe/Bucharest',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

function LiveClock() {
  const [time, setTime] = useState('--:--')

  useEffect(() => {
    const update = () => setTime(bucharestClock.format(new Date()))
    update()
    const now = new Date()
    const delay = (60 - now.getSeconds()) * 1000 - now.getMilliseconds()
    let interval = 0
    const timeout = window.setTimeout(() => {
      update()
      interval = window.setInterval(update, 60_000)
    }, delay)
    return () => {
      window.clearTimeout(timeout)
      window.clearInterval(interval)
    }
  }, [])

  return <p suppressHydrationWarning>La cârmă · {time}</p>
}

export default function Footer() {
  const linkClass = 'transition-colors hover:text-[var(--text)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--gold)]'

  return (
    <footer className="border-t border-[var(--line)] bg-[var(--bg)] text-sm text-[var(--text-3)]">
      <div className="site-container flex flex-col gap-6 py-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p>MAST Studio</p>
          <nav aria-label="Linkuri juridice" className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/confidentialitate" className={linkClass}>Confidențialitate</Link>
            <Link href="/cookies" className={linkClass}>Cookies</Link>
            <Link href="/termeni" className={linkClass}>Termeni</Link>
          </nav>
        </div>

        <div className="flex flex-col gap-3 border-t border-[var(--line)] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <p>© 2026 MAST Studio · MAST Consult S.R.L. · Timișoara</p>
            <LiveClock />
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <a href="mailto:contact@maststudio.ro" className={linkClass}>contact@maststudio.ro</a>
            <a href="https://anpc.ro/ce-este-sal" target="_blank" rel="noopener" className={linkClass}>ANPC SAL</a>
            <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener" className={linkClass}>SOL</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
