import type { ServicePage } from '@/lib/services'

export type ServiceText = Pick<
  ServicePage,
  | 'name'
  | 'shortName'
  | 'h1'
  | 'seoTitle'
  | 'metaDescription'
  | 'answerCapsule'
  | 'priceLabel'
  | 'deliveryLabel'
  | 'deliveryTime'
  | 'intro'
  | 'includes'
  | 'notIncluded'
  | 'process'
  | 'forWho'
  | 'faq'
  | 'waMessage'
  | 'serviceType'
>

export const serviceTextEn: Record<string, ServiceText> = {
  'site-de-prezentare': {
    name: 'Presentation website',
    shortName: 'Presentation website',
    h1: 'Presentation website design',
    seoTitle: 'Presentation website, from 300 EUR',
    metaDescription:
      'A presentation website for a small business: a unique design, copy included, up to 5 pages. From 300 EUR, live in 48 hours after we have your materials.',
    answerCapsule:
      'A presentation website at MAST Studio starts at 300 EUR and goes live in 48 hours from the moment we receive your materials. It includes a unique design, copy we write, a mobile version, and speed optimisation. You pay a 50 EUR deposit, and the rest only if you are happy with the result.',
    priceLabel: 'from 300 EUR',
    deliveryLabel: 'Delivery time',
    deliveryTime: '48 hours after materials',
    intro:
      'The presentation website is the first thing a potential client sees about your business. We build it to say clearly what you do, to earn trust, and to turn visitors into messages and phone calls, not into visits that leave no trace.',
    includes: [
      'a unique design built for your business',
      'full copywriting',
      'up to 5 pages',
      'a version optimised for phones',
      'speed optimisation',
      'a WhatsApp button',
      'a contact form',
      'basic SEO',
      'a handover walkthrough',
    ],
    notIncluded: [
      'the domain and hosting (50–120 EUR a year, in your company’s name)',
      'professional photography',
      'advertising campaigns',
    ],
    process: [
      { step: 'You write to us on WhatsApp or email', description: 'You tell us what you do and what you want. You get a fixed-price quote the same day.' },
      { step: 'You send the basic materials', description: 'Text, photos, a logo, whatever you already have. The 48 hours start the moment we receive them.' },
      { step: 'We build it and send you a live link', description: 'You see a working website, not a mockup. You ask for changes if you need them.' },
      { step: 'You pay the rest and get the full handover', description: 'The access, the documentation, and a short walkthrough of how to use it.' },
    ],
    forWho: [
      'medical and veterinary practices',
      'salons and beauty clinics',
      'service firms and trades',
      'consultants and liberal professions',
      'restaurants and cafés',
    ],
    faq: [
      {
        question: 'What does a presentation website actually cost?',
        answer:
          'From 300 EUR for a presentation website of up to 5 pages, with a custom design, copy included, and speed optimisation. The final price depends on the number of pages and on how much material you already have ready.',
      },
      {
        question: 'Why is it delivered in only 48 hours?',
        answer:
          'Because we have a fixed, repeatable process, with no useless stages and no middlemen. The clock starts when we receive your materials, not when the contract is signed.',
      },
      {
        question: 'What if I don’t have copy or photos ready?',
        answer:
          'We write the copy as part of the package. For professional photographs we can recommend a photographer, but that cost is separate from the price.',
      },
      {
        question: 'Can I ask for changes after I see the live site?',
        answer:
          'Yes. The first round of changes is included in the price, precisely because we want you to see the result before you pay the rest.',
      },
      {
        question: 'Is the website optimised for Google?',
        answer:
          'Yes. You get basic SEO: correct titles, a fast load, and a structure search engines can read. Advanced SEO or advertising campaigns are separate services.',
      },
    ],
    waMessage: 'Hi! I want a presentation website, delivered in 48 hours. Can you send me a quote?',
    serviceType: 'Presentation website design',
  },
  'magazin-online': {
    name: 'Online store',
    shortName: 'Online store',
    h1: 'Online store design',
    seoTitle: 'Online store, from 900 EUR',
    metaDescription:
      'An online store with card payments, order management, invoicing, and couriers. From 900 EUR, delivered in 7 days after your materials. 50 EUR deposit.',
    answerCapsule:
      'An online store at MAST Studio starts at 900 EUR and is delivered in 7 days. It includes a product catalogue, card payments, order management, and a connection to your invoicing software. You pay a 50 EUR deposit, and the rest only if you are happy.',
    priceLabel: 'from 900 EUR',
    deliveryLabel: 'Delivery time',
    deliveryTime: '7 days after materials',
    intro:
      'A good online store sells while you sleep. We build the product catalogue, the online payments, and the order flow so you no longer manage the technical side by hand. You just handle the parcels.',
    includes: [
      'a product catalogue with categories and filters',
      'a shopping cart and a streamlined checkout',
      'online card payments',
      'order management in your own dashboard',
      'a connection to your invoicing software',
      'a connection to couriers for delivery',
      'a version optimised for phones',
      'basic SEO',
      'a handover walkthrough',
    ],
    notIncluded: [
      'the domain and hosting (50–120 EUR a year, in your company’s name)',
      'professional product photography',
      'advertising campaigns',
    ],
    process: [
      { step: 'You write to us on WhatsApp or email', description: 'You tell us what you sell and how many products you have. You get a fixed-price quote the same day.' },
      { step: 'You send the product catalogue', description: 'Photos, prices, descriptions, whatever you already have. The 7 days start the moment we receive them.' },
      { step: 'We build it and send you a live link', description: 'You test the whole flow, from catalogue to payment, before you pay the rest.' },
      { step: 'You pay the rest and get the full handover', description: 'The access, the documentation, and a walkthrough of how to run the store.' },
    ],
    forWho: [
      'merchants with physical products',
      'small producers and makers',
      'shops that want to sell online as well as in person',
      'brands that sell directly to the customer',
      'distributors who want their own sales channel',
    ],
    faq: [
      {
        question: 'What does an online store actually cost?',
        answer:
          'From 900 EUR for a catalogue with integrated payments and order management. The final price depends on the number of products and on the connections you need (invoicing, couriers, ERP).',
      },
      {
        question: 'What payment methods can my customers use?',
        answer:
          'Card payment built directly into the store, through the payment processors available in Romania. We can also add cash on delivery or a bank transfer, on request.',
      },
      {
        question: 'Does the store connect to my invoicing?',
        answer:
          'Yes. We connect the store to invoicing software such as SmartBill or Oblio, so invoices are issued automatically with each order.',
      },
      {
        question: 'How many products can the store hold?',
        answer:
          'There is no fixed limit in the platform. The number of products affects how long it takes to fill the catalogue, which can push delivery past the standard 7 days.',
      },
      {
        question: 'Can I run the store myself after the handover?',
        answer:
          'Yes. You get access to an admin panel where you add products, follow orders, and manage stock, plus a full walkthrough at handover.',
      },
    ],
    waMessage: 'Hi! I want an online store. Can you send me a quote?',
    serviceType: 'Online store design',
  },
  'aplicatii-web': {
    name: 'Web and mobile apps',
    shortName: 'Web and mobile apps',
    h1: 'Web and mobile app development',
    seoTitle: 'Web and mobile app development',
    metaDescription:
      'Web and mobile apps for internal processes, client portals, and bookings. A fixed-price quote in 24 hours, built in stages, with a full handover.',
    answerCapsule:
      'Web and mobile apps are estimated individually, and the fixed-price quote arrives within 24 hours of the first conversation. We build internal tools that automate repetitive work, client portals, and booking systems, in stages, with access to the progress.',
    priceLabel: 'custom quote',
    deliveryLabel: 'Delivery time',
    deliveryTime: 'estimated in the quote',
    intro:
      'If a process in your business is still done by hand too often — quotes, bookings, records kept in Excel — we turn it into an app your team will actually use, from a computer or a phone.',
    includes: [
      'an analysis of the requirements and the workflow',
      'a custom interface design',
      'user accounts and roles',
      'connections to other systems (invoicing, payments, external APIs)',
      'an admin panel',
      'an interface designed for phone and desktop',
      'testing and launch',
      'a handover walkthrough',
    ],
    notIncluded: [
      'the domain and hosting (a variable cost, depending on the infrastructure)',
      'the cost of third-party services (payments, SMS, email)',
      'ongoing maintenance after the warranty period',
    ],
    process: [
      { step: 'You write to us on WhatsApp or email', description: 'You describe the process you want to solve. We book a short 30-minute conversation.' },
      { step: 'You get the quote within 24 hours', description: 'A fixed price, an estimated timeline, and the exact scope of the first version.' },
      { step: 'We build in stages, with access to the progress', description: 'You see the app working as we go, not only at the end.' },
      { step: 'Launch and a full handover', description: 'The access, the technical documentation, and a walkthrough for your team.' },
    ],
    forWho: [
      'businesses with repetitive internal processes',
      'teams that need a portal for their clients',
      'companies that want a booking or reservation system',
      'organisations that need connections between existing systems',
      'firms that keep important records in Excel or on paper',
    ],
    faq: [
      {
        question: 'Why isn’t a fixed price shown?',
        answer:
          'Because every app is different in scope and complexity. A simple internal tool costs much less than a system with many roles and integrations, so the price is set once we understand exactly what has to be built.',
      },
      {
        question: 'How long does it take to build an app?',
        answer:
          'It depends on the complexity: from a few weeks for a simple internal tool, to a few months for a system with many roles and integrations. The exact timeline comes with the quote.',
      },
      {
        question: 'What happens in the first conversation?',
        answer:
          'You describe the process, we ask about the real workflow and about what the app should do. It takes no more than 30 minutes and there is no cost.',
      },
      {
        question: 'Can I ask for changes during the build?',
        answer:
          'Yes. We build in stages and give you access to the progress as we go, precisely so the direction can be adjusted in time, not only at the end.',
      },
      {
        question: 'Do you offer maintenance after launch?',
        answer:
          'Yes, on request. You can take a maintenance and ongoing-development subscription, discussed separately, or continue with your own team using the documentation from the handover.',
      },
    ],
    waMessage: 'Hi! I need a web or mobile app. Can we talk?',
    serviceType: 'Web application development',
  },
  'platforme-saas': {
    name: 'SaaS platforms',
    shortName: 'SaaS platforms',
    h1: 'Custom SaaS platforms',
    seoTitle: 'Custom SaaS: from idea to launch',
    metaDescription:
      'Custom SaaS platforms: accounts, subscriptions, and online payments, built in stages from the first version to the first customers. A fixed quote in 24 hours.',
    answerCapsule:
      'A custom SaaS platform is estimated individually, with a quote within 24 hours of the first conversation. We start from a clear first version, with accounts, subscriptions, and online payments, and build it in stages, with access to the progress, up to the first users who pay.',
    priceLabel: 'custom quote',
    deliveryLabel: 'Delivery time',
    deliveryTime: 'estimated in the quote',
    intro:
      'Do you have an idea for a digital product that customers would pay for every month? We help you turn it into a real platform: together we decide what goes into the first version, we build it in stages, and we launch it without extra features that delay the first customers.',
    includes: [
      'defining the first version (MVP) and the priorities',
      'a custom interface design',
      'user accounts, roles, and permissions',
      'subscriptions and recurring online payments',
      'an admin panel for you and your team',
      'connections to external services (invoicing, email, SMS)',
      'testing and launch',
      'technical documentation at handover',
    ],
    notIncluded: [
      'hosting and infrastructure (a variable cost, depending on the number of users)',
      'the cost of third-party services (payment processor, email, SMS)',
      'marketing and launch campaigns',
    ],
    process: [
      { step: 'You describe the idea', description: 'On WhatsApp or email, then in a short 30-minute conversation about customers, the problem, and the subscription model.' },
      { step: 'You get the quote within 24 hours', description: 'A fixed price for the first version, an estimated timeline, and the exact list of features included.' },
      { step: 'We build in stages, with access to the progress', description: 'You see the platform working as we go, and we adjust the direction in time.' },
      { step: 'Launch and a full handover', description: 'The access, the technical documentation, and a plan for the next versions.' },
    ],
    forWho: [
      'founders with an idea for a digital product',
      'businesses that want to turn their experience into a subscription',
      'firms that want to sell an internal tool to other companies',
      'projects that need accounts, subscriptions, and payments',
    ],
    faq: [
      {
        question: 'What does a custom SaaS platform cost?',
        answer:
          'It depends on what goes into the first version, which is why we don’t show a fixed price. After a short conversation you get, within 24 hours, a fixed-price quote for the first version and an estimated timeline.',
      },
      {
        question: 'What is an MVP, and why do we start with one?',
        answer:
          'An MVP is the first version real customers can use, with only the features that are strictly necessary. You find out quickly whether people will pay for the product, before you invest in features nobody may use.',
      },
      {
        question: 'Who owns the platform’s code?',
        answer:
          'You do. At handover you receive the access and the technical documentation, as with any MAST Studio project, and you can continue development with us or with another team.',
      },
      {
        question: 'Can I ask for changes during the build?',
        answer:
          'Yes. We build in stages and give you access to the progress as we go, precisely so the direction can be adjusted in time, not only at the end.',
      },
      {
        question: 'What happens after launch?',
        answer:
          'You can continue with a maintenance and development subscription, discussed separately, or go on with your own team, using the documentation from the handover.',
      },
    ],
    waMessage: 'Hi! I want to build a custom platform. Can we talk?',
    serviceType: 'SaaS platform development',
  },
  mentenanta: {
    name: 'Maintenance and growth',
    shortName: 'Maintenance',
    h1: 'Website maintenance',
    seoTitle: 'Website maintenance, from 90 EUR/month',
    metaDescription:
      'Website maintenance from 90 EUR a month, with no long-term contract: updates, backups, monitoring, and small changes. We also take on sites built by others.',
    answerCapsule:
      'Website maintenance at MAST Studio starts at 90 EUR a month, with no long-term contract. It includes updates, backups, basic monitoring, and small content changes. Hosting and the domain stay separate, in your company’s name.',
    priceLabel: 'from 90 EUR/month',
    deliveryLabel: 'Contract',
    deliveryTime: 'monthly, with no long-term commitment',
    intro:
      'A website left alone for months becomes slow, exposed, or simply out of date. We take on the day-to-day care, so you don’t hear about problems from your clients, and you always have someone who answers when you want a change.',
    includes: [
      'platform and dependency updates, when they are needed',
      'regular backups',
      'basic monitoring: we check that the site responds',
      'small content edits and specific corrections',
      'a monthly pass for speed and basic SEO',
      'one clear person to talk to when something fails',
    ],
    notIncluded: [
      'a full redesign or rebrand',
      'a new online store built from scratch',
      'advertising campaigns (Google Ads, Meta Ads)',
      'unlimited blog or social media content',
      'new apps or large integrations (ERP, marketplaces)',
      'the domain and hosting (50–120 EUR a year, in your company’s name)',
    ],
    process: [
      { step: 'You write to us on WhatsApp or email', description: 'You tell us whether the site was built by us or by someone else, and what problems you’ve noticed.' },
      { step: 'We check access and the state of the site', description: 'Domain, hosting, code, or admin panel: without access, nobody can do serious maintenance.' },
      { step: 'We confirm what the subscription covers', description: 'You get a clear list of what the subscription covers for your site, before you pay anything.' },
      { step: 'We start monthly', description: 'You pay monthly and stop when you no longer need it, with no multi-year contract.' },
    ],
    forWho: [
      'businesses whose website brings calls, bookings, or orders',
      'owners who don’t have time for updates and backups',
      'firms that have been through “it broke and I don’t know who to call”',
      'websites built by other firms, after we check the access',
    ],
    faq: [
      {
        question: 'What does website maintenance cost?',
        answer:
          'From 90 EUR a month, with no long-term contract. The price covers the ongoing care of the site, not a major redesign or advertising campaigns.',
      },
      {
        question: 'Can I stop maintenance whenever I want?',
        answer:
          'Yes. The model is monthly, with no long-term commitment. You tell us you’re stopping, and you are not tied to hidden annual packages.',
      },
      {
        question: 'Is maintenance the same thing as hosting?',
        answer:
          'No. Hosting keeps the site on a server, and the domain is its address; both are paid separately, in your company’s name, roughly 50–120 EUR a year. Maintenance means updates, backups, basic monitoring, and support for day-to-day problems.',
      },
      {
        question: 'Can you take on a website built by someone else?',
        answer:
          'Usually yes, after a quick check of the access and the technical state. If the site has serious problems, we tell you up front what is realistic inside the monthly subscription and what needs to be rebuilt.',
      },
      {
        question: 'How long does it take when something isn’t working?',
        answer:
          'It depends on the problem: a text correction is quick, while an outage tied to hosting or the domain may need steps with that provider. We don’t promise a deadline we can’t guarantee. We tell you what we see and what happens next, on WhatsApp or email.',
      },
      {
        question: 'Do I need maintenance if the website is new?',
        answer:
          'Not necessarily from day one, but it is useful if you don’t want to handle updates and backups yourself. You can start whenever you feel you no longer have time for the technical side.',
      },
    ],
    waMessage: 'Hi! I’m interested in maintenance and growth for my website.',
    serviceType: 'Website maintenance',
  },
  'automatizari-whatsapp': {
    name: 'WhatsApp automation',
    shortName: 'WhatsApp automation',
    h1: 'WhatsApp automation for small businesses',
    seoTitle: 'WhatsApp automation for small businesses',
    metaDescription:
      'WhatsApp automation from 250 EUR: replies after hours, booking confirmations, and service information. You approve every message that is sent.',
    answerCapsule:
      'WhatsApp automation from MAST Studio starts at 250 EUR: replies outside opening hours, booking confirmations, service information, and order status. Together we set 2–4 useful flows, you approve every text, and the decisions stay with you.',
    priceLabel: 'from 250 EUR',
    deliveryLabel: 'Timeline',
    deliveryTime: 'set in the quote, after the number of flows',
    intro:
      'You get the same messages dozens of times a week: “are you open?”, “how much is it?”, “can you confirm the time?”. We automate the repetitive ones, so you don’t lose clients at night or at the weekend, and you have time for the people who actually need you.',
    includes: [
      'an analysis of the messages you repeat most often',
      '2–4 reply flows set up in advance',
      'an automatic reply outside opening hours',
      'booking confirmations and reminders',
      'information you approve: hours, indicative prices, coverage area',
      'handing the conversation to a person when the client asks',
      'testing on real numbers before launch',
    ],
    notIncluded: [
      'a chatbot that invents answers, prices, or advice',
      'replacing reception or sales entirely',
      'complex flows tied to an ERP or a large app (a separate quote)',
      'the cost of third-party services, if the flows use them',
    ],
    process: [
      { step: 'You write down the messages you repeat', description: 'A short list of questions you get often, your opening hours, and the WhatsApp Business account you use.' },
      { step: 'We set 2–4 useful flows', description: 'Not 20. We start with what eats the most of your time, and the quote says exactly what we automate.' },
      { step: 'You approve the texts', description: 'Nothing goes out to clients until you have read and approved the message.' },
      { step: 'We test and launch', description: 'We check the flows on real numbers, then leave them live and update them when the hours or prices change.' },
    ],
    forWho: [
      'practices and salons that confirm appointments on WhatsApp',
      'shops that often get questions about orders',
      'service firms that answer the same price questions',
      'businesses that lose messages after hours or at the weekend',
    ],
    faq: [
      {
        question: 'What does WhatsApp automation cost?',
        answer:
          'It starts at 250 EUR, for scenarios such as automatic replies and confirmations. The exact number of flows and any integrations are agreed before we start, on WhatsApp or email.',
      },
      {
        question: 'What can I automate on WhatsApp?',
        answer:
          'Booking confirmations, replies outside working hours, information about prices or services, and order updates. The aim is not to lose clients when you are busy or closed.',
      },
      {
        question: 'Do I need a website to have WhatsApp automation?',
        answer:
          'Not necessarily. A presentation website with a clear WhatsApp button does, however, raise the chance that new people contact you, so the two complement each other.',
      },
      {
        question: 'Does the automation replace reception or sales?',
        answer:
          'No. It covers the repetitive questions and the confirmations. The decisions, the advice, and the relationship with the client stay with you or your team.',
      },
      {
        question: 'How long does the setup take?',
        answer:
          'It depends on how many flows you want and how clear the texts are. We don’t have a standard timeline the way we do for a presentation website. We set it in the quote, once we know exactly what we are automating.',
      },
    ],
    waMessage: 'Hi! I’m interested in automation and WhatsApp for my business.',
    serviceType: 'WhatsApp automation',
  },
}
