export default function ContactButton() {
  return (
    <a
      id="contact"
      href="https://wa.me/[PHONE]?text=Salut!%20Vreau%20sa%20discutam%20despre%20un%20proiect%20web."
      className="rounded-full font-medium uppercase tracking-widest text-[#F5F1E8] cursor-pointer px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base"
      style={{
        background: 'linear-gradient(123deg, #0B1F3A 7%, #1B3A5C 37%, #A8862B 72%, #C9A227 100%)',
        boxShadow: '0px 4px 4px rgba(201,162,39,0.25), 4px 4px 12px rgba(11,31,58,0.9) inset',
        outline: '2px solid #F5F1E8',
        outlineOffset: '-3px',
      }}
    >
      Hai să discutăm
    </a>
  )
}
