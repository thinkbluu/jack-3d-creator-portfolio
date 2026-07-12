import ContactButton from './ContactButton'
import FadeIn from './FadeIn'

export default function FinalCTA() {
  return (
    <section id="contact" className="bg-[#050A14] px-5 pb-20 pt-4 sm:px-8 sm:pb-24 md:px-10 md:pb-32">
      <FadeIn delay={0.1} y={20}>
        <div className="flex flex-col items-center py-20 text-center sm:py-24 md:py-32">
          <ContactButton />
          <p className="mt-6 text-sm font-light text-[#C9A227] opacity-90">
            Lucrăm cu maximum 4 proiecte noi pe lună. Rezervă-ți locul.
          </p>
          <p className="mt-4 text-xs text-[#F5F1E8] opacity-35">
            Working with international clients? Everything here, delivered in English too.
          </p>
        </div>
      </FadeIn>
    </section>
  )
}
