'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { ArrowDown, Building2, Check, Layers3, Menu, Scissors, ShoppingCart, X } from 'lucide-react'
import ContactButton from './ContactButton'
import ScrubStage from './ScrubStage'
import { useSegment, type Segment } from './SegmentContext'

const navLinks: Array<{ href: string; label: string }> = [
  { href: '#dovada', label: 'Dovada' },
  { href: '#servicii', label: 'Servicii' },
  { href: '#process', label: 'Cum lucrăm' },
  { href: '#faq', label: 'Întrebări' },
  { href: '#contact', label: 'Contact' },
]

const clips = [
  { src: '/images/hero-01-exit.mp4', poster: '/images/hero-poster.jpg' },
  { src: '/images/hero-02-arrival.mp4', poster: '/images/harbor-final.jpg' },
]

const options: Array<{ id: Segment; eyebrow: string; title: string; icon: typeof Scissors }> = [
  { id: 'salon', eyebrow: 'Programări', title: 'Am un salon', icon: Scissors },
  { id: 'servicii', eyebrow: 'Cereri', title: 'Ofer servicii', icon: Building2 },
  { id: 'ecommerce', eyebrow: 'Vânzări', title: 'Vând produse', icon: ShoppingCart },
  { id: 'platforma', eyebrow: 'Produs digital', title: 'Construiesc o platformă', icon: Layers3 },
]

const subheads: Record<Segment | 'default', string> = {
  default: 'Spune-ne ce construiești. Îți arătăm drumul cel mai scurt spre un site care produce rezultate.',
  salon: 'Transformăm atenția în programări, cu o experiență clară și rapidă pentru clienții salonului tău.',
  servicii: 'Punem valoarea serviciilor tale în cuvinte și pagini care inspiră încredere și generează cereri.',
  ecommerce: 'Un magazin online care convertește: catalog, plăți, comenzi și facturare, fără abandon de coș.',
  platforma: 'Clarificăm produsul, fluxurile și tehnologia pentru o platformă pregătită să crească.',
}

const stats: Array<{ value: string; label: string }> = [
  { value: '48h', label: 'de la conținut la site live' },
  { value: '300€', label: 'site de prezentare de la' },
]

const EASE = [0.22, 1, 0.36, 1] as const

// Standard CSS cubic-bezier(x1,y1,x2,y2) evaluated at a given progress `x`
// via Newton-Raphson, so the skip-intro scroll can reuse the exact same
// easing curve as the rest of the site without depending on
// `scroll-behavior: smooth` (which would apply globally to every anchor).
function makeCubicBezierEasing(x1: number, y1: number, x2: number, y2: number) {
  const sampleCurveX = (t: number) => 3 * (1 - t) * (1 - t) * t * x1 + 3 * (1 - t) * t * t * x2 + t ** 3
  const sampleCurveY = (t: number) => 3 * (1 - t) * (1 - t) * t * y1 + 3 * (1 - t) * t * t * y2 + t ** 3
  const sampleCurveDerivativeX = (t: number) =>
    3 * (1 - t) * (1 - t) * x1 + 6 * (1 - t) * t * (x2 - x1) + 3 * t * t * (1 - x2)

  return (x: number) => {
    if (x <= 0) return 0
    if (x >= 1) return 1
    let t = x
    for (let i = 0; i < 8; i++) {
      const currentX = sampleCurveX(t) - x
      if (Math.abs(currentX) < 1e-6) break
      const slope = sampleCurveDerivativeX(t)
      if (Math.abs(slope) < 1e-6) break
      t -= currentX / slope
    }
    return sampleCurveY(t)
  }
}

const skipScrollEase = makeCubicBezierEasing(0.22, 1, 0.36, 1)

// `<html>` has a global `scroll-behavior: smooth`, which also governs the
// default (`behavior: 'auto'`) case for `window.scrollTo`. Without this, the
// browser would layer its own smooth animation on top of every frame of the
// skip button's own eased rAF loop, wrecking the fixed 900ms timing. Toggling
// scroll-behavior off for the instant of the call — a standard workaround —
// keeps every other anchor on the page smooth while this one jump is instant.
function scrollToInstant(top: number) {
  const root = document.documentElement
  const previous = root.style.scrollBehavior
  root.style.scrollBehavior = 'auto'
  window.scrollTo(0, top)
  root.style.scrollBehavior = previous
}

// Three depth tiers of dust. Parallax lives on the tier wrapper, the slow upward
// drift lives on each dot, so the two transforms never fight each other.
const dustTiers: Array<{
  shift: number
  size: number
  opacity: number
  blur: number
  dots: Array<{ left: string; top: string; duration: string; delay: string }>
}> = [
  {
    shift: 20,
    size: 4,
    opacity: 0.55,
    blur: 0,
    dots: [
      { left: '18%', top: '68%', duration: '9s', delay: '0s' },
      { left: '63%', top: '38%', duration: '11s', delay: '1.4s' },
      { left: '81%', top: '74%', duration: '10s', delay: '2.8s' },
      { left: '41%', top: '86%', duration: '12s', delay: '4.1s' },
    ],
  },
  {
    shift: 12,
    size: 3,
    opacity: 0.35,
    blur: 0,
    dots: [
      { left: '29%', top: '24%', duration: '13s', delay: '0.6s' },
      { left: '72%', top: '57%', duration: '14s', delay: '2.2s' },
      { left: '54%', top: '17%', duration: '12s', delay: '3.5s' },
      { left: '88%', top: '46%', duration: '15s', delay: '5s' },
    ],
  },
  {
    shift: 4,
    size: 2,
    opacity: 0.2,
    blur: 1,
    dots: [
      { left: '11%', top: '41%', duration: '15s', delay: '1s' },
      { left: '47%', top: '61%', duration: '16s', delay: '2.6s' },
      { left: '68%', top: '86%', duration: '14s', delay: '4.4s' },
      { left: '93%', top: '29%', duration: '16s', delay: '6s' },
    ],
  },
]

// Minimal line-art mast glyph — mast, yard arm, and a single sail — drawn
// inline so the title card has no dependency on a separate SVG asset file.
function MastMark({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="50" y1="8" x2="50" y2="92" />
      <line x1="30" y1="92" x2="70" y2="92" />
      <line x1="50" y1="18" x2="80" y2="24" />
      <path d="M50 18 L50 46 L21 46 Z" />
    </svg>
  )
}

function SkipIntroButton({
  opacity,
  pointerEvents,
  onSkip,
}: {
  opacity: MotionValue<number>
  pointerEvents: MotionValue<'auto' | 'none'>
  onSkip: () => void
}) {
  return (
    <motion.button
      type="button"
      onClick={onSkip}
      aria-label="Sari peste secvența de intro"
      className="absolute z-20 flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-[var(--glass-edge)] text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--ink-2)] transition-[background-color,color,transform] duration-200 ease-out hover:-translate-y-px hover:bg-[rgba(250,247,242,0.95)] hover:text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brass)]"
      style={{
        bottom: 'clamp(24px, 4vh, 40px)',
        right: 'clamp(24px, 4vw, 48px)',
        background: 'rgba(250, 247, 242, 0.82)',
        backdropFilter: 'blur(12px)',
        padding: '10px 20px',
        opacity,
        pointerEvents,
      }}
    >
      Sari peste intro
      <ArrowDown aria-hidden="true" size={13} />
    </motion.button>
  )
}

function MirrorCard({
  option,
  selected,
  onSelect,
  compact = false,
}: {
  option: (typeof options)[number]
  selected: boolean
  onSelect: () => void
  compact?: boolean
}) {
  const Icon = option.icon
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={`flex flex-col justify-between gap-2 rounded-[12px] border text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brass)] ${compact ? 'min-h-[76px] p-3' : 'min-h-24 p-3'} ${selected ? 'border-[var(--brass)] bg-[var(--brass)] text-[var(--shell)]' : 'border-[var(--glass-edge)] bg-[rgba(245,241,232,0.05)] text-[var(--ink)] hover:border-[var(--glass-edge)]'}`}
    >
      <span className={`flex size-8 items-center justify-center rounded-[8px] border ${selected ? 'border-[var(--shell)]/30' : 'border-[var(--glass-edge)] text-[var(--brass)]'}`}>
        {selected ? <Check aria-hidden="true" size={16} /> : <Icon aria-hidden="true" size={16} />}
      </span>
      <span className="flex flex-col gap-0.5">
        <span className={`uppercase tracking-[0.2em] ${compact ? 'text-[11px]' : 'text-[9px]'} ${selected ? 'text-[var(--shell)]/70' : 'text-[var(--brass)]'}`}>{option.eyebrow}</span>
        <span className={`font-semibold leading-tight ${compact ? 'text-[13px]' : 'text-sm'}`}>{option.title}</span>
      </span>
    </button>
  )
}

export default function CinematicHero() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const { segment, setSegment } = useSegment()
  const [cinematic, setCinematic] = useState(false)
  const [depth, setDepth] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const menuCloseRef = useRef<HTMLButtonElement | null>(null)
  const menuTriggerRef = useRef<HTMLButtonElement | null>(null)

  // Body scroll lock + focus handoff while the mobile menu overlay is open,
  // restored on close so the trigger regains focus.
  useEffect(() => {
    if (!menuOpen) return
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    menuCloseRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        return
      }
      if (event.key !== 'Tab' || !menuRef.current) return
      const focusable = menuRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = overflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [menuOpen])

  const closeMenu = useCallback(() => {
    setMenuOpen(false)
    menuTriggerRef.current?.focus()
  }, [])

  // SSR-safe: render the static variant first, upgrade only when the device allows it.
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const touch = window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0
    const narrow = window.innerWidth < 1024
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    if (!reduceMotion && !touch && !narrow && !connection?.saveData) setCinematic(true)
  }, [])

  // Depth interaction is desktop-with-a-real-cursor only, and never under reduced motion.
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const capable = window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)').matches
    if (!reduceMotion && capable) setDepth(true)
  }, [])

  // Raw pointer position, normalized to -0.5..0.5. Written imperatively so the
  // pointer path never touches React state.
  const pointerXRaw = useMotionValue(0)
  const pointerYRaw = useMotionValue(0)
  const pointerX = useSpring(pointerXRaw, { stiffness: 50, damping: 20 })
  const pointerY = useSpring(pointerYRaw, { stiffness: 50, damping: 20 })

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const rect = event.currentTarget.getBoundingClientRect()
      pointerXRaw.set((event.clientX - rect.left) / rect.width - 0.5)
      pointerYRaw.set((event.clientY - rect.top) / rect.height - 0.5)
    },
    [pointerXRaw, pointerYRaw],
  )

  const handlePointerLeave = useCallback(() => {
    pointerXRaw.set(0)
    pointerYRaw.set(0)
  }, [pointerXRaw, pointerYRaw])

  // Panel tilt, with a shadow that swings opposite to the tilt.
  const panelRotateY = useTransform(pointerX, [-0.5, 0.5], [-8, 8])
  const panelRotateX = useTransform(pointerY, [-0.5, 0.5], [8, -8])
  const shadowX = useTransform(pointerX, [-0.5, 0.5], [26, -26])
  const shadowY = useTransform(pointerY, [-0.5, 0.5], [26, -26])
  const panelShadow = useMotionTemplate`${shadowX}px ${shadowY}px 64px rgba(2, 5, 10, 0.42), inset 0 1px 0 rgba(245, 241, 232, 0.08)`

  // Layered parallax inside the panel: nearer copy travels further.
  const headingX = useTransform(pointerX, [-0.5, 0.5], [-10, 10])
  const headingY = useTransform(pointerY, [-0.5, 0.5], [-10, 10])
  const subheadX = useTransform(pointerX, [-0.5, 0.5], [-6, 6])
  const subheadY = useTransform(pointerY, [-0.5, 0.5], [-6, 6])
  const cardsX = useTransform(pointerX, [-0.5, 0.5], [-4, 4])
  const cardsY = useTransform(pointerY, [-0.5, 0.5], [-4, 4])
  const statsX = useTransform(pointerX, [-0.5, 0.5], [-2, 2])
  const statsY = useTransform(pointerY, [-0.5, 0.5], [-2, 2])

  // One parallax pair per dust tier, near to far.
  const nearDustX = useTransform(pointerX, [-0.5, 0.5], [-20, 20])
  const nearDustY = useTransform(pointerY, [-0.5, 0.5], [-20, 20])
  const midDustX = useTransform(pointerX, [-0.5, 0.5], [-12, 12])
  const midDustY = useTransform(pointerY, [-0.5, 0.5], [-12, 12])
  const farDustX = useTransform(pointerX, [-0.5, 0.5], [-4, 4])
  const farDustY = useTransform(pointerY, [-0.5, 0.5], [-4, 4])
  const dustMotion = [
    { x: nearDustX, y: nearDustY },
    { x: midDustX, y: midDustY },
    { x: farDustX, y: farDustY },
  ]

  // Vignette hotspot follows the cursor at ±6%.
  const vignetteX = useTransform(pointerX, [-0.5, 0.5], ['-6%', '6%'])
  const vignetteY = useTransform(pointerY, [-0.5, 0.5], ['-6%', '6%'])
  const vignette =
    useMotionTemplate`radial-gradient(circle at calc(50% + ${vignetteX}) calc(50% + ${vignetteY}), transparent 45%, rgba(26, 23, 20, 0.18) 100%)`

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 30, restDelta: 0.0005 })

  const tint = useTransform(progress, [0, 0.35, 0.5, 0.75, 1], [0.1, 0.1, 0, 0.18, 0.18])
  const tintBackground = useMotionTemplate`rgba(250, 247, 242, ${tint})`
  // Panel stays hidden and non-interactive through the title-card beat, then
  // lifts in once for the rest of the scrub — no more early show/mid-hide.
  const panelOpacity = useTransform(progress, [0, 0.72, 0.85, 1], [0, 0, 1, 1])
  const panelY = useTransform(progress, [0, 0.72, 0.85, 1], [28, 28, 0, 0])
  const panelPointerEvents = useTransform(progress, (value) => (value < 0.72 ? 'none' : 'auto'))
  const cueOpacity = useTransform(progress, [0, 0.06], [1, 0])
  // Title card: in fast, holds, then clears well before the panel begins its reveal.
  const titleOpacity = useTransform(progress, [0, 0.04, 0.14, 0.24], [0, 1, 1, 0])

  // Skip-intro button visibility, driven off scroll progress rather than
  // state: pointless before the sequence gets going, pointless again once
  // the panel has already taken over.
  const skipOpacity = useTransform(progress, [0, 0.02, 0.06, 0.7, 0.78], [0, 0, 1, 1, 0])
  const skipPointerEvents = useTransform(skipOpacity, (value) => (value < 0.1 ? 'none' : 'auto'))

  // Whether this session already skipped the intro once — read after mount
  // only, so there is no SSR/client mismatch on first paint.
  const [introSkipped, setIntroSkipped] = useState(false)
  useEffect(() => {
    try {
      setIntroSkipped(sessionStorage.getItem('mast-intro-skipped') === '1')
    } catch {
      setIntroSkipped(false)
    }
  }, [])

  // Returning mid-session after a skip: jump straight to the end of the rig
  // (panel already visible) instead of replaying the whole sequence. Waits a
  // frame so the 320vh cinematic height has actually painted before measuring it.
  useEffect(() => {
    if (!cinematic || !introSkipped) return
    const frame = requestAnimationFrame(() => {
      const rig = sectionRef.current
      if (!rig) return
      const target = rig.offsetTop + rig.offsetHeight - window.innerHeight
      scrollToInstant(target)
    })
    return () => cancelAnimationFrame(frame)
  }, [cinematic, introSkipped])

  // Custom rAF-driven scroll for the skip button: fixed 900ms so it never
  // takes seconds to cover the ~320vh rig, using the site's own easing curve
  // instead of `scroll-behavior: smooth` (which would apply to every anchor
  // on the page, not just this one).
  const skipAnimationRef = useRef<number | null>(null)

  const cancelSkipAnimation = useCallback(() => {
    if (skipAnimationRef.current !== null) {
      cancelAnimationFrame(skipAnimationRef.current)
      skipAnimationRef.current = null
    }
  }, [])

  // The animation cancels itself the moment the user intervenes.
  useEffect(() => {
    const stop = () => cancelSkipAnimation()
    window.addEventListener('wheel', stop, { passive: true })
    window.addEventListener('touchstart', stop, { passive: true })
    return () => {
      window.removeEventListener('wheel', stop)
      window.removeEventListener('touchstart', stop)
    }
  }, [cancelSkipAnimation])

  useEffect(() => cancelSkipAnimation, [cancelSkipAnimation])

  const handleSkip = useCallback(() => {
    const rig = sectionRef.current
    if (!rig) return

    try {
      sessionStorage.setItem('mast-intro-skipped', '1')
    } catch {
      // sessionStorage may be unavailable (private mode, etc.) — skipping
      // still works for this visit, it just won't be remembered.
    }

    const target = rig.offsetTop + rig.offsetHeight - window.innerHeight
    const start = window.scrollY
    const distance = target - start
    const duration = 900
    let startTime: number | null = null

    cancelSkipAnimation()

    const step = (now: number) => {
      if (startTime === null) startTime = now
      const elapsed = now - startTime
      const t = Math.min(elapsed / duration, 1)
      scrollToInstant(start + distance * skipScrollEase(t))
      skipAnimationRef.current = t < 1 ? requestAnimationFrame(step) : null
    }

    skipAnimationRef.current = requestAnimationFrame(step)
  }, [cancelSkipAnimation])

  const enter = (index: number) => ({
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay: index * 0.09, ease: EASE },
  })

  // Shared between the desktop scrub layout and the mobile stacked layout so
  // the nav markup — including the hamburger overlay wiring — is written once.
  const header = (
    <header className="absolute inset-x-0 top-0 z-30">
      <nav aria-label="Navigație principală" className="site-container flex h-20 items-center justify-between">
        <a href="#home" className="flex items-baseline gap-2 text-xl font-extrabold tracking-[0.16em] text-[var(--ink)]">
          MAST <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--brass)]">Studio</span>
        </a>
        <div className="hidden items-center gap-5 text-xs uppercase tracking-[0.16em] md:flex md:gap-8">
          <a href="#dovada" className="text-[var(--ink-2)] transition-colors hover:text-[var(--ink)]">Dovada</a>
          <a href="#servicii" className="text-[var(--ink-2)] transition-colors hover:text-[var(--ink)]">Servicii</a>
          <ContactButton label="Vorbește cu noi" />
        </div>
        <button
          ref={menuTriggerRef}
          type="button"
          aria-label="Deschide meniul"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen(true)}
          className="flex size-11 items-center justify-center text-[var(--ink)] md:hidden"
        >
          <Menu size={24} aria-hidden="true" />
        </button>
      </nav>
    </header>
  )

  const menuOverlay = menuOpen && (
    <div
      id="mobile-menu"
      ref={menuRef}
      role="dialog"
      aria-modal="true"
      aria-label="Meniu mobil"
      className="fixed inset-0 z-50 flex flex-col bg-[var(--shell)] md:hidden"
    >
      <div className="site-container flex h-20 items-center justify-between">
        <a href="#home" onClick={closeMenu} className="flex items-baseline gap-2 text-xl font-extrabold tracking-[0.16em] text-[var(--ink)]">
          MAST <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--brass)]">Studio</span>
        </a>
        <button
          ref={menuCloseRef}
          type="button"
          aria-label="Închide meniul"
          onClick={closeMenu}
          className="flex size-11 items-center justify-center text-[var(--ink)]"
        >
          <X size={24} aria-hidden="true" />
        </button>
      </div>
      <nav aria-label="Linkuri principale" className="flex flex-1 flex-col px-5">
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={closeMenu}
            className="border-b border-[var(--hairline)] py-[18px] text-[20px] text-[var(--ink)] transition-colors hover:text-[var(--brass)]"
          >
            {link.label}
          </a>
        ))}
      </nav>
      <div className="mast-cta-full px-5 pb-8">
        <ContactButton label="Vorbește cu noi" />
      </div>
    </div>
  )

  return (
    <section ref={sectionRef} id="home" className={`relative min-h-[100dvh] ${cinematic ? 'lg:h-[320vh]' : 'lg:h-screen'}`}>
      {header}
      {menuOverlay}

      {/* This wrapper's own height must track the section's h-screen/h-[320vh]
          exactly. It sits between the section and the sticky child; without an
          explicit height it would auto-size to the sticky child's own height
          (a plain sticky box still occupies normal-flow space), leaving no
          extra scroll room for the child to stay pinned while the page
          scrolls — breaking the whole scroll-jack effect on desktop. */}
      <div className="hidden h-full lg:block">
      <div
        className="sticky top-0 h-screen overflow-hidden"
        style={{
          height: '100dvh',
          ...(depth ? { perspective: '1200px', transformStyle: 'preserve-3d' as const } : null),
        }}
        onPointerMove={depth ? handlePointerMove : undefined}
        onPointerLeave={depth ? handlePointerLeave : undefined}
      >
        {cinematic ? (
          <ScrubStage clips={clips} progress={progress} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/images/harbor-final.jpg" alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
        )}

        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={cinematic ? { background: tintBackground } : { background: 'rgba(250, 247, 242, 0.18)' }}
        />

        {depth && (
          <>
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[5]">
              {dustTiers.map((tier, tierIndex) => (
                <motion.div
                  key={tier.shift}
                  className="absolute inset-0"
                  style={{ x: dustMotion[tierIndex].x, y: dustMotion[tierIndex].y }}
                >
                  {tier.dots.map((dot) => (
                    <span
                      key={`${dot.left}-${dot.top}`}
                      className="hero-dust absolute rounded-full bg-[var(--ink)]"
                      style={{
                        left: dot.left,
                        top: dot.top,
                        width: tier.size,
                        height: tier.size,
                        opacity: tier.opacity,
                        ...(tier.blur ? { filter: `blur(${tier.blur}px)` } : null),
                        animationDuration: dot.duration,
                        animationDelay: dot.delay,
                      }}
                    />
                  ))}
                </motion.div>
              ))}
            </div>

            <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[6]" style={{ background: vignette }} />
          </>
        )}

        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-10 h-32 bg-[linear-gradient(180deg,rgba(250,247,242,0.82)_0%,transparent_100%)]" />

        {cinematic && (
          // Fades in first over the establishing shot, clears well before the
          // panel starts its own reveal — never rendered on the static fallback,
          // where the nav wordmark already carries the brand.
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-3"
            style={{ opacity: titleOpacity, textShadow: '0 2px 24px rgba(250, 247, 242, 0.7)' }}
          >
            <span className="text-[var(--brass)]">
              <MastMark size={88} />
            </span>
            <div className="flex flex-col items-center gap-1">
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '34px', color: 'var(--ink)' }}>
                MAST
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 500,
                  fontSize: '12px',
                  letterSpacing: '.3em',
                  color: 'var(--ink-2)',
                }}
              >
                STUDIO
              </span>
            </div>
          </motion.div>
        )}

        <motion.div
          className="porthole absolute z-10 w-[min(680px,calc(100%-2rem))]"
          style={{
            left: 'clamp(24px, 5vw, 72px)',
            bottom: 'clamp(28px, 6vh, 72px)',
            padding: 'clamp(22px, 2.6vw, 34px)',
            // Extra floor clearance so the stats row never sits on the panel edge.
            paddingBottom: 'clamp(32px, 4vw, 44px)',
            maxHeight: 'calc(100dvh - 7rem)',
            background: 'rgba(250, 247, 242, 0.90)',
            // Column flow lets the stats row claim the leftover height with margin-top:auto.
            display: 'flex',
            flexDirection: 'column',
            opacity: cinematic ? panelOpacity : 1,
            y: cinematic ? panelY : 0,
            // Under the static/reduced-motion fallback there is no scrub progress
            // to gate on, so the panel is simply interactive from the first paint.
            pointerEvents: cinematic ? panelPointerEvents : 'auto',
            ...(depth
              ? {
                  rotateY: panelRotateY,
                  rotateX: panelRotateX,
                  boxShadow: panelShadow,
                  transformStyle: 'preserve-3d' as const,
                }
              : null),
          }}
        >
          <motion.p {...enter(0)} className="kicker">Studio de web design · Timișoara</motion.p>

          <motion.div style={depth ? { x: headingX, y: headingY } : undefined}>
            <motion.h1 {...enter(1)} className="type-display mt-4">
              Site-ul care îți aduce<br />
              <span className="text-[var(--brass)]">clienți.</span>
            </motion.h1>
          </motion.div>

          <motion.div style={depth ? { x: subheadX, y: subheadY } : undefined}>
            <motion.p {...enter(2)} key={segment ?? 'default'} className="type-body mt-4">
              {subheads[segment ?? 'default']}
            </motion.p>
          </motion.div>

          <motion.div style={depth ? { x: cardsX, y: cardsY } : undefined}>
          <motion.div
            {...enter(3)}
            role="group"
            aria-label="Alege tipul afacerii"
            className="mt-5 grid"
            style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}
          >
            {options.map((option) => (
              <MirrorCard
                key={option.id}
                option={option}
                selected={segment === option.id}
                onSelect={() => setSegment(segment === option.id ? null : option.id)}
              />
            ))}
          </motion.div>
          </motion.div>

          <motion.div {...enter(4)} className="mt-5 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <ContactButton hero label={segment ? 'Discută ruta potrivită' : 'Spune-ne ce construiești'} />
            <p className="text-xs leading-relaxed text-[var(--ink-2)]">Răspundem direct pe WhatsApp. Fără formular, fără prezentare de vânzări.</p>
          </motion.div>

          <motion.div style={{ marginTop: 'auto', ...(depth ? { x: statsX, y: statsY } : null) }}>
          <motion.dl {...enter(5)} className="mt-5 flex items-stretch gap-6">
            {stats.map((stat, index) => (
              <div key={stat.value} className={`flex flex-col gap-1 ${index > 0 ? 'border-l border-[var(--glass-edge)] pl-6' : ''}`}>
                <dt className="porthole-stat">{stat.value}</dt>
                <dd className="max-w-36 text-[11px] leading-relaxed text-[var(--ink-2)]">{stat.label}</dd>
              </div>
            ))}
          </motion.dl>
          </motion.div>
        </motion.div>

        {cinematic && (
          <motion.div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-3" style={{ opacity: cueOpacity }}>
            <span className="scrub-cue-line h-10 w-px" />
            <span className="kicker">Descoperă</span>
          </motion.div>
        )}

        {cinematic && !introSkipped && (
          <SkipIntroButton opacity={skipOpacity} pointerEvents={skipPointerEvents} onSkip={handleSkip} />
        )}
      </div>
      </div>

      {/* Mobile/tablet layout (<1024px): normal vertical flow instead of the
          sticky, absolutely-positioned desktop panel — cinematic is always
          false at this width, so there is no scrub video to coordinate with. */}
      <div className="flex min-h-[100dvh] flex-col bg-[var(--shell)] lg:hidden">
        <div className="relative h-[42dvh] w-full shrink-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/harbor-final.jpg"
            alt=""
            aria-hidden="true"
            width={1600}
            height={1000}
            loading="eager"
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: 'center 60%' }}
          />
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(250,247,242,0.7)_0%,transparent_100%)]" />
        </div>

        <div className="flex flex-1 flex-col" style={{ padding: '28px 20px 32px' }}>
          <p className="kicker" style={{ fontSize: '10.5px', letterSpacing: '.18em' }}>Studio de web design · Timișoara</p>

          <h1
            className="mt-4 text-balance"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 550,
              fontSize: 'clamp(2rem, 8.5vw, 2.6rem)',
              lineHeight: 1.06,
              letterSpacing: '-0.02em',
              color: 'var(--ink)',
            }}
          >
            Site-ul care îți aduce <span className="text-[var(--brass)]">clienți.</span>
          </h1>

          <p
            className="mt-4"
            style={{ fontSize: '15px', lineHeight: 1.55, maxWidth: '34ch', color: 'var(--ink-2)' }}
          >
            {subheads[segment ?? 'default']}
          </p>

          <div role="group" aria-label="Alege tipul afacerii" className="mt-5 grid grid-cols-2 gap-2">
            {options.map((option) => (
              <MirrorCard
                key={option.id}
                option={option}
                selected={segment === option.id}
                onSelect={() => setSegment(segment === option.id ? null : option.id)}
                compact
              />
            ))}
          </div>

          <div className="mast-cta-full mt-5">
            <ContactButton hero label={segment ? 'Discută ruta potrivită' : 'Spune-ne ce construiești'} />
          </div>
          <p className="mt-3 text-center text-[11.5px] leading-relaxed text-[var(--ink-2)]">
            Răspundem direct pe WhatsApp. Fără formular, fără prezentare de vânzări.
          </p>

          <dl className="mt-6 grid grid-cols-2">
            {stats.map((stat, index) => (
              <div
                key={stat.value}
                className={`flex flex-col items-center gap-1 text-center ${index > 0 ? 'border-l border-[var(--glass-edge)]' : ''}`}
              >
                <dt style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '26px', letterSpacing: '-0.02em', color: 'var(--brass)' }}>
                  {stat.value}
                </dt>
                <dd className="max-w-36 text-[11px] leading-relaxed text-[var(--ink-2)]">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
