'use client'

import { MessageCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

const WHATSAPP_URL = 'https://wa.me/40755928029?text=Salut!%20Vreau%20o%20oferta%20pentru%20un%20site.'

export default function MobileWhatsAppBar() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const update = () => setVisible(window.scrollY > window.innerHeight)
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <div className={`fixed inset-x-0 bottom-0 z-40 border-t border-[rgba(201,162,39,0.3)] bg-[rgba(5,10,20,0.85)] p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur transition-transform duration-300 md:hidden ${visible ? 'translate-y-0' : 'translate-y-full'}`}>
      <a href={WHATSAPP_URL} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#C9A227] py-3.5 font-medium text-[#050A14]">
        <MessageCircle size={18} aria-hidden="true" />
        Cere ofertă pe WhatsApp
      </a>
    </div>
  )
}
