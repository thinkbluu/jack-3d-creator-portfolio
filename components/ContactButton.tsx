interface ContactButtonProps {
  hero?: boolean
}

export default function ContactButton({ hero = false }: ContactButtonProps) {
  return (
    <div className="flex flex-col items-center">
      <a
        href="https://wa.me/40755928029?text=Salut!%20Vreau%20o%20ofert%C4%83%20pentru%20un%20site."
        className={`cursor-pointer whitespace-nowrap rounded-[12px] bg-[var(--gold)] font-semibold uppercase tracking-[0.18em] text-[var(--bg)] shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] transition-[filter,transform] hover:-translate-y-px hover:brightness-[1.06] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--gold-soft)] ${hero ? 'px-8 py-4 text-sm sm:px-10 sm:py-4' : 'px-6 py-3 text-xs sm:px-8 sm:py-3.5'}`}
      >
        {hero ? 'Vreau site-ul meu în 48h' : 'Cere ofertă pe WhatsApp'}
      </a>
      <p className="mt-3 text-center text-xs font-medium tracking-wide text-[var(--text-3)]">
        răspuns în aceeași zi · fără nicio obligație
      </p>
    </div>
  )
}
