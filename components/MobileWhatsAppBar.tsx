'use client'

import { MessageCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import TrackedLink from './TrackedLink'

const WHATSAPP_URL = 'https://wa.me/40755928029?text=Salut!%20Vreau%20o%20ofert%C4%83%20pentru%20un%20site.'

export default function MobileWhatsAppBar() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const update = () => setVisible(window.scrollY > window.innerHeight)
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update) }
  }, [])

  return (
    <div className={`fixed inset-x-0 bottom-0 z-40 border-t border-[var(--line)] bg-[var(--surface)] p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] transition-transform md:hidden ${visible ? 'translate-y-0' : 'translate-y-full'}`}>
      <TrackedLink href={WHATSAPP_URL} eventName="whatsapp_cta_click" eventProperties={{ placement: 'mobile_sticky' }} className="flex w-full items-center justify-center gap-2 rounded-[12px] bg-[var(--gold)] py-3.5 font-semibold text-[var(--bg)] shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] hover:-translate-y-px hover:brightness-[1.06] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--gold-soft)]">
        <MessageCircle size={18} aria-hidden="true" />
        Cere ofertă pe WhatsApp
      </TrackedLink>
    </div>
  )
}
