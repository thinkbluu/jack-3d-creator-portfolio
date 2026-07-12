interface ContactButtonProps {
  hero?: boolean
}

export default function ContactButton({ hero = false }: ContactButtonProps) {
  return (
    <div className="flex flex-col items-center">
      <a
        href="https://wa.me/40755928029?text=Salut!%20Vreau%20o%20oferta%20pentru%20un%20site."
        className="rounded-full font-medium uppercase tracking-widest text-white cursor-pointer px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base"
        style={{
          background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
          boxShadow: '0px 4px 4px rgba(181, 1, 167, 0.25), inset 4px 4px 12px #7721B1',
          outline: '2px solid white',
          outlineOffset: '-3px',
        }}
      >
        {hero ? 'Vreau site-ul meu în 48h' : 'Cere ofertă pe WhatsApp'}
      </a>
      <p className="mt-3 text-center text-xs sm:text-sm font-light tracking-wide text-[#F5F1E8] opacity-45">
        răspuns în aceeași zi · fără nicio obligație
      </p>
    </div>
  )
}
