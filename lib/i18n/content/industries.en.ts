import type { Industry } from '@/lib/industries'

export type IndustryText = Pick<
  Industry,
  'name' | 'h1' | 'seoTitle' | 'metaDescription' | 'answerCapsule' | 'intro' | 'problems' | 'dataPoint' | 'faq' | 'waMessage'
>

export const industryTextEn: Record<string, IndustryText> = {
  'clinici-medicale': {
    name: 'Medical and dental clinics',
    h1: 'Websites and digital solutions for medical clinics',
    seoTitle: 'Medical and dental clinic websites',
    metaDescription:
      'A website, online booking and an AI assistant for medical and dental clinics: patients quickly find what you offer, what it costs and how to book.',
    answerCapsule:
      'For a medical or dental clinic we build a clear, phone-first website with services, doctors, indicative prices and online booking, plus an AI assistant that answers patients at any hour. Everything follows medical advertising rules and GDPR.',
    intro:
      'Patients compare clinics on their phone, usually in the evening, and call wherever they quickly find what they are looking for: the service, the doctor, the price and a free slot. A good website does all of that on the first screen and answers questions without another phone call.',
    problems: [
      'patients call just to ask for the schedule or the prices',
      'booking happens only by phone, during working hours',
      'no-shows cost the practice hours',
      'the website does not show the doctors and their specialisations',
    ],
    dataPoint: {
      text: 'In our study of 200 businesses in Timișoara, 88% of medical clinics and 84% of dental practices in the top Google results had their own website. Without one, you are in the minority that loses patients.',
      source: 'MAST Studio study, October 2026',
    },
    faq: [
      {
        question: 'What does a clinic website need?',
        answer:
          'The services, the doctors and their specialisations, indicative prices, the schedule, the address with a map and simple booking, all easy to find on a phone.',
      },
      {
        question: 'Can the AI assistant give medical advice?',
        answer:
          'No. It only answers administrative questions from the information you approve, such as schedule, prices and how to prepare for an investigation, and it passes any medical question to a human.',
      },
    ],
    waMessage: 'Hi! I run a medical clinic and I would like to talk about a website.',
  },
  'cabinete-veterinare': {
    name: 'Veterinary practices',
    h1: 'Websites and digital solutions for veterinary practices',
    seoTitle: 'Veterinary practice website',
    metaDescription:
      'A website for veterinary practices with emergencies, hours and a call button in the first screen, plus online booking and vaccine and check-up reminders.',
    answerCapsule:
      'For a veterinary practice we build a website where a worried owner finds emergencies, hours, the address and the call button in the first screen. We add online booking and automatic reminders for vaccines and check-ups.',
    intro:
      'An owner looking for a vet is often scared and on their phone. They do not read, they scan: is it open, where is it, how do I call. The website must answer in three seconds.',
    problems: [
      'emergencies and hours are not visible quickly on mobile',
      'vaccine reminders are done manually or not at all',
      'many new clients cannot find the practice on Google',
      'repetitive questions tie up the phone',
    ],
    dataPoint: {
      text: 'In our study, only 12 out of 25 veterinary practices in the top Google results in Timișoara had their own website.',
      source: 'MAST Studio study, October 2026',
    },
    faq: [
      {
        question: 'What matters most on a veterinary practice website?',
        answer: 'Emergencies, hours, the address and the call button, visible immediately on mobile. Everything else comes after.',
      },
      {
        question: 'Can vaccine reminders be sent automatically?',
        answer: 'Yes, through the booking system or through WhatsApp automations, with messages you approve.',
      },
    ],
    waMessage: 'Hi! I run a veterinary practice and I would like to talk about a website.',
  },
  'saloane-infrumusetare': {
    name: 'Salons and aesthetic clinics',
    h1: 'Websites and online booking for beauty salons',
    seoTitle: 'Salon website and booking',
    metaDescription:
      'A website for salons and aesthetic clinics with services, prices, a real gallery and commission-free online booking, tied to Instagram and WhatsApp.',
    answerCapsule:
      'For salons and aesthetic clinics we build a website with easy-to-read services and prices, a real gallery, commission-free online booking and a link to Instagram and WhatsApp, so you no longer depend on the algorithm.',
    intro:
      'Instagram brings attention, but it is not yours: the algorithm changes, and the client searching on Google cannot find you. Your own website, with online booking, turns attention into appointments.',
    problems: [
      'bookings arrive only in messages, at any hour',
      'prices are given dozens of times a day in private messages',
      'booking platforms take a commission and place you next to competitors',
      'on Google only the map profile shows up',
    ],
    dataPoint: {
      text: 'In our study of 25 salons in the top Google results in Timișoara, only 5 had their own website. This is the field with the biggest gap in the city.',
      source: 'MAST Studio study, October 2026',
    },
    faq: [
      {
        question: 'Do I need a website if I have Instagram?',
        answer:
          'Yes, if you want to be found by people who do not follow you yet. Instagram shows your work, the website brings clients from Google and makes booking simple.',
      },
      {
        question: 'Does online booking replace messages?',
        answer:
          'For most clients, yes. Those who prefer to write can still write, and the AI assistant can also take bookings from the conversation.',
      },
    ],
    waMessage: 'Hi! I run a beauty salon and I would like to talk about a website.',
  },
  'avocati-contabili': {
    name: 'Lawyers, accountants and consultants',
    h1: 'Websites for lawyers, accountants and consultants',
    seoTitle: 'Lawyer and accountant website',
    metaDescription:
      'A sober website for lawyers, accounting firms and consultants: practice areas, team, trust and discreet contact, in Romanian and English.',
    answerCapsule:
      'For lawyers, accountants and consultants we build sober websites that convey trust: clear practice areas, the team with its experience, articles that answer clients’ questions and a discreet contact. On request, in Romanian and English.',
    intro:
      'Clients of liberal professions choose on trust, and trust forms before the first phone call. A clear, sober and up-to-date website says more about your seriousness than any slogan.',
    problems: [
      'the website does not explain the practice areas in plain language',
      'few reviews, so new clients have no proof',
      'foreign clients cannot find information in English',
      'basic questions take up billable time',
    ],
    dataPoint: {
      text: 'In our study, accounting firms in the top Google results in Timișoara had a median of only 8 reviews, and only 13 out of 25 had their own website.',
      source: 'MAST Studio study, October 2026',
    },
    faq: [
      {
        question: 'What does a lawyer’s website need?',
        answer:
          'Practice areas explained clearly, the lawyers’ profiles, useful articles and a discreet contact, respecting the profession’s rules on advertising.',
      },
      {
        question: 'Is a website in two languages worth it?',
        answer: 'Yes, if you work with foreign clients or partners. We build it with the same structure in Romanian and English.',
      },
    ],
    waMessage: 'Hi! I run a law or accounting practice and I would like to talk about a website.',
  },
  meseriasi: {
    name: 'Trades and home services',
    h1: 'Websites for tradespeople and service firms',
    seoTitle: 'Trades and home services website',
    metaDescription:
      'A website for plumbers, electricians and renovation firms: the areas you work in, real jobs, an always visible call button and a tidy Google profile.',
    answerCapsule:
      'For tradespeople and home-service firms we build a simple, fast website for mobile, with the areas you work in, photos of real jobs and the call button always visible, plus a tidy Google profile that brings calls from your neighbourhoods.',
    intro:
      'Someone with a burst pipe does not read, they call. The first tradesperson who shows up on the map, has photos of real jobs and a number you can tap gets the job. The rest never even learn they existed.',
    problems: [
      'the old website does not open or leads elsewhere',
      'few reviews on Google',
      'it is not clear which areas you work in',
      'photos of jobs stay on the phone only',
    ],
    dataPoint: {
      text: 'In our study, 3 of the 16 tradespeople’s own websites in Timișoara did not open or sent the visitor to another firm, and the median number of reviews was 14.',
      source: 'MAST Studio study, October 2026',
    },
    faq: [
      {
        question: 'Do I need a website if I have a Google profile?',
        answer:
          'The profile brings the calls, the website confirms them: people check your jobs and areas before they dial. Together they work far better.',
      },
      {
        question: 'What photos should I put on the website?',
        answer: 'Real jobs, before and after, taken with your phone, are more convincing than any stock photo.',
      },
    ],
    waMessage: 'Hi! I run a trades business and I would like to talk about a website.',
  },
  'magazine-online': {
    name: 'Online stores',
    h1: 'An online store that sells on mobile',
    seoTitle: 'An online store that sells on mobile',
    metaDescription:
      'An online store built around completing the order on mobile: shipping visible in the cart, card and cash on delivery, and no overlays over the buy button.',
    answerCapsule:
      'For online stores we build everything around completing the order on mobile, where sales are won or lost: the shipping cost visible in the cart, card and cash on delivery payment, no windows covering the buy button, and every legal element in place.',
    intro:
      'Most visitors to a Romanian store come from mobile, and most of them leave in the last two steps. A good store is not just pretty, it is built so that nothing stands between the client and the order button.',
    problems: [
      'the shipping cost appears only at the end',
      'windows and floating buttons cover the cart button',
      'a cookie banner without a refuse option',
      'the store is slow on mobile',
    ],
    dataPoint: {
      text: 'When we tested 50 Romanian online stores on mobile, all of them had at least one problem, and only 48% showed the shipping cost before checkout.',
      source: 'MAST Studio study, October 2026',
    },
    faq: [
      {
        question: 'Why do I lose clients at checkout?',
        answer:
          'Most often because of costs that appear at the end, too many steps and elements that cover buttons on mobile. We design them out from the start.',
      },
      {
        question: 'Can I have both cash on delivery and card?',
        answer: 'Yes. In Romania, cash on delivery remains in high demand, so we offer both.',
      },
    ],
    waMessage: 'Hi! I run an online store and I would like to talk about a website.',
  },
}
