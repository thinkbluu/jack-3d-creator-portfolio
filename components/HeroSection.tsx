'use client'

import FadeIn from './FadeIn'
import Magnet from './Magnet'
import ContactButton from './ContactButton'

const navLinks = [
  { label: 'Despre', href: '#about' },
  { label: 'Servicii', href: '#price' },
  { label: 'Proiecte', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

export default function HeroSection() {
  return (
    <section
      className="h-screen flex flex-col"
      style={{ background: '#050A14', overflowX: 'clip', position: 'relative' }}
    >
      {/* Navbar */}
      <FadeIn delay={0} y={-20}>
        <nav className="flex justify-between items-center px-6 md:px-10 pt-6 md:pt-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[#F5F1E8] font-medium uppercase tracking-wider text-sm md:text-lg lg:text-[1.4rem] hover:opacity-70 transition-opacity duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </FadeIn>

      {/* Hero Heading */}
      <FadeIn delay={0.15} y={40}>
        <div className="overflow-hidden">
          <h1
            className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap w-full text-[13vw] sm:text-[14vw] md:text-[15vw] lg:text-[16vw] mt-6 sm:mt-4 md:-mt-5"
          >
            MAST STUDIO
          </h1>
        </div>
      </FadeIn>

      {/* Portrait - absolutely centered */}
      <FadeIn delay={0.6} y={30} className="absolute left-1/2 -translate-x-1/2 z-10 top-1/2 -translate-y-1/2 sm:top-auto sm:translate-y-0 sm:bottom-0">
        <Magnet
          padding={150}
          strength={3}
          activeTransition="transform 0.3s ease-out"
          inactiveTransition="transform 0.6s ease-in-out"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/mast-hero.png"
            alt="Busolă aurie MAST Studio"
            className="w-[280px] sm:w-[360px] md:w-[440px] lg:w-[520px]"
            style={{ display: 'block' }}
          />
        </Magnet>
      </FadeIn>

      {/* Bottom Bar */}
      <div className="mt-auto flex justify-between items-end pb-7 sm:pb-8 md:pb-10 px-6 md:px-10">
        <FadeIn delay={0.35} y={20}>
          <p
            className="text-[#F5F1E8] font-light uppercase tracking-wide leading-snug max-w-[160px] sm:max-w-[220px] md:max-w-[260px]"
            style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}
          >
            studio de web design care construiește site-uri memorabile pentru afaceri românești
          </p>
        </FadeIn>
        <FadeIn delay={0.5} y={20}>
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  )
}
