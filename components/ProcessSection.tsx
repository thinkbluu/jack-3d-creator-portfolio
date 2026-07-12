import FadeIn from './FadeIn'

const steps = [
  { number: '01', title: 'Ne scrii pe WhatsApp', description: 'Ne spui în două fraze ce faci și ce îți trebuie. În aceeași zi primești întrebările noastre și oferta.' },
  { number: '02', title: 'Trimiți conținutul', description: 'Texte de bază, poze și logo, ghidate de checklist-ul nostru. Din acest moment pornește cronometrul.' },
  { number: '03', title: 'Site-ul e live', description: '48 de ore pentru site-uri de prezentare, 7 zile pentru magazine. Plătești 50% la start și 50% doar când ești mulțumit.' },
]

export default function ProcessSection() {
  return (
    <section className="bg-[#050A14] px-5 py-24 sm:px-8 sm:py-32 md:px-10">
      <h2 className="hero-heading mb-16 text-center font-black uppercase leading-none tracking-tight" style={{ fontSize: 'clamp(2.5rem, 9vw, 120px)' }}>
        Cum lucrăm
      </h2>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 md:grid-cols-3">
        {steps.map((step, index) => (
          <FadeIn key={step.number} delay={index * 0.15} y={24}>
            <span className="font-black leading-none text-transparent" style={{ fontSize: 'clamp(4rem, 8vw, 7rem)', WebkitTextStroke: '1px rgba(201,162,39,0.5)' }}>
              {step.number}
            </span>
            <h3 className="mt-2 text-lg font-medium uppercase text-[#F5F1E8]">{step.title}</h3>
            <p className="mt-2 text-sm font-light leading-relaxed text-[#F5F1E8] opacity-50">{step.description}</p>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}
