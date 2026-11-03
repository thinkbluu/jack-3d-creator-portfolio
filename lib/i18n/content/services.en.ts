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
  | 'packages'
  | 'faq'
  | 'waMessage'
  | 'serviceType'
>

export const serviceTextEn: Record<string, ServiceText> = {
  'site-de-prezentare': {
    name: 'Presentation website',
    shortName: 'Presentation website',
    h1: 'Presentation website design for businesses',
    seoTitle: 'Presentation website, from 300 EUR',
    metaDescription:
      'Presentation website design for businesses in Romania and abroad: unique design, copywriting included, built for phones first. From 300 EUR, live in 48 hours.',
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
      {
        question: 'Do you only work with businesses in Timișoara?',
        answer:
          'No. We are based in Timișoara, but we work remotely with businesses across Romania and abroad. Everything can be done over WhatsApp, email and video calls.',
      },
      {
        question: 'Will my website appear in ChatGPT or Google AI?',
        answer:
          'We build it with structured data and clear copy, which also helps with AI search. For full preparation, with a Google profile and directories, there is the separate AI visibility service.',
      },
    ],
    waMessage: 'Hi! I want a presentation website, delivered in 48 hours. Can you send me a quote?',
    serviceType: 'Presentation website design',
  },
  'magazin-online': {
    name: 'Online store',
    shortName: 'Online store',
    h1: 'Custom online store development',
    seoTitle: 'Online store, from 900 EUR',
    metaDescription:
      'Custom online store development, no themes: card and cash on delivery, invoicing, couriers and a checkout built for phones. From 900 EUR.',
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
      {
        question: 'Why does the checkout on phones matter?',
        answer:
          'Because that is where most sales are lost. When we tested 50 Romanian online stores on a phone, every single one had at least one problem, and only 48% showed the delivery cost before checkout. We build ours to avoid exactly these mistakes.',
      },
      {
        question: 'Do you build stores on Shopify or WooCommerce?',
        answer:
          'We build custom stores, without ready-made themes, so they are fast and look like your brand. If you need a specific admin system, we discuss it before the quote.',
      },
    ],
    waMessage: 'Hi! I want an online store. Can you send me a quote?',
    serviceType: 'Online store design',
  },
  'aplicatii-web': {
    name: 'Web and mobile apps',
    shortName: 'Web and mobile apps',
    h1: 'Custom web and mobile app development',
    seoTitle: 'Mobile app development, fixed-price quote',
    metaDescription:
      'Custom web and mobile app development: client portals, booking, internal tools and built-in AI. A fixed-price quote within 24 hours.',
    answerCapsule:
      'Web and mobile apps are estimated individually, and the fixed-price quote arrives within 24 hours of the first conversation. We build internal tools that automate repetitive work, client portals, and booking systems, in stages, with access to the progress.',
    priceLabel: 'custom quote',
    deliveryLabel: 'Delivery time',
    deliveryTime: 'estimated in the quote',
    intro:
      'If a process in your business is still done by hand too often — quotes, bookings, records kept in Excel — we turn it into a mobile app for iOS and Android, or a web app, that your team will actually use, from a computer or a phone.',
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
      {
        question: 'Can you integrate artificial intelligence into the app?',
        answer:
          'Yes. We have built apps that recognise nutritional values from photos, analyse microbiome data and map drone data in real time. If AI is the core of the project, see also the custom AI solutions service.',
      },
      {
        question: 'Do you also build apps for iPhone and Android?',
        answer:
          'Yes. Depending on the project, we build web apps that work on any phone or mobile apps published on the App Store and Google Play. We recommend the right option in the quote.',
      },
    ],
    waMessage: 'Hi! I need a web or mobile app. Can we talk?',
    serviceType: 'Web application development',
  },
  'aplicatii-mobile': {
    name: 'iOS and Android mobile apps',
    shortName: 'Mobile apps',
    h1: 'iOS and Android mobile app development',
    seoTitle: 'iOS and Android mobile app development',
    metaDescription:
      'We build mobile apps for iPhone and Android: from the first version to App Store and Google Play release, with AI built in where it adds real value.',
    answerCapsule:
      'MAST Studio develops mobile apps for iPhone and Android from a single code base, from design and the first version to release on the App Store and Google Play. We build in stages, with test versions on your own phone, and we integrate AI where it brings real value. The quote with the price arrives within 24 hours.',
    priceLabel: 'quote within 24 hours',
    deliveryLabel: 'Timeline',
    deliveryTime: 'in stages, set out in the quote',
    intro:
      'A mobile app makes sense when your customers use it often: they book, order, follow a result or receive notifications. We first help you decide whether you need a mobile app or a web app, then we build it in stages, so you can test it on your own phone from the first weeks.',
    includes: [
      'an analysis: mobile app or web app, whichever suits you',
      'interface design for the phone',
      'a single code base for iPhone and Android',
      'accounts, notifications, in-app payments, when needed',
      'AI features: image recognition, recommendations, an assistant',
      'test versions on your own phone along the way',
      'release on the App Store and Google Play',
      'the code and the developer accounts in your name',
    ],
    notIncluded: [
      'the Apple and Google developer account fees',
      'promoting the app after release (separate)',
      'complex 3D games',
    ],
    process: [
      { step: 'Discussion and quote', description: 'We understand what the app must do. The quote with stages and price arrives within 24 hours.' },
      { step: 'Design', description: 'The key screens, tested on the phone before programming.' },
      { step: 'Building in stages', description: 'You receive test versions on your phone and give feedback along the way.' },
      { step: 'Release and handover', description: 'We release it to the stores and hand over the code and the accounts.' },
    ],
    forWho: [
      'clinics and practices with patients who come back often',
      'services with bookings and subscriptions',
      'startups with a mobile product',
      'companies that want an internal app for their field teams',
    ],
    faq: [
      {
        question: 'How much does a mobile app cost?',
        answer:
          'It depends on the number of screens, the features and the integrations, so we make a quote after the first discussion, within 24 hours. We usually start with a small first version, so you can test the idea before the big investment.',
      },
      {
        question: 'Mobile app or web app?',
        answer:
          'If people use it rarely or find it through Google, a web app is usually enough and cheaper. If they open it often, receive notifications or use the camera and the location, a mobile app is worth it.',
      },
      {
        question: 'Do you release the app on the App Store and Google Play?',
        answer:
          'Yes, we handle the whole release process, on your company’s developer accounts.',
      },
      {
        question: 'Can you integrate AI into the app?',
        answer:
          'Yes. We have built apps that recognise nutritional values from a photo and apps that analyse complex data for personalised recommendations.',
      },
    ],
    waMessage: 'Hi! I have an idea for a mobile app. Can we talk?',
    serviceType: 'iOS and Android app development',
  },
  'platforme-saas': {
    name: 'SaaS platforms',
    shortName: 'SaaS platforms',
    h1: 'Custom SaaS platform development',
    seoTitle: 'Custom SaaS: from idea to launch',
    metaDescription:
      'SaaS platform development from idea to first customers: accounts, subscriptions, payments and AI where it adds value. Built in stages, quote in 24 hours.',
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
      {
        question: 'Can you build a SaaS with AI features?',
        answer:
          'Yes. We integrate AI models where they bring real value to users, from personalised recommendations to document analysis, and we keep running costs under control through the architecture.',
      },
    ],
    waMessage: 'Hi! I want to build a custom platform. Can we talk?',
    serviceType: 'SaaS platform development',
  },
  'mvp-startup': {
    name: 'MVP for startups',
    shortName: 'Startup MVP',
    h1: 'Startup MVP development',
    seoTitle: 'Startup MVP development',
    metaDescription:
      'We build the first version of your product in 4-8 weeks: just what you need to test the idea with real customers. Web, mobile or SaaS, AI where it counts.',
    answerCapsule:
      'An MVP is the first version of your product, with only the features needed to test it with real customers. At MAST Studio we build it in 4-8 weeks, as a web, mobile or SaaS application, with clean design, payments and usage analytics. The quote arrives within 24 hours, and the code stays yours.',
    priceLabel: 'quote within 24 hours',
    deliveryLabel: 'Timeline',
    deliveryTime: '4-8 weeks for the first version',
    intro:
      'Most startups lose months and money building features nobody uses. A good MVP does the opposite: it picks the two or three things that prove the idea is worth it, builds them well and puts them quickly in front of customers. Then you decide with data, not with assumptions.',
    includes: [
      'a definition workshop: what goes into the first version and what waits',
      'product design for the key screens',
      'a web, mobile or SaaS application, depending on the product',
      'accounts, payments and subscriptions, when needed',
      'usage analytics, so you can see what people use',
      'a launch to the first users',
      'code and accounts in your name, ready to be developed further',
    ],
    notIncluded: [
      'the marketing and sales after the launch',
      'features that are not needed to test the idea',
      'equity or payment in company shares',
    ],
    process: [
      { step: 'Definition workshop', description: 'We set the hypothesis to test and the 2-3 features that prove it.' },
      { step: 'Fast design', description: 'The key screens, tested with 3-5 people from your audience.' },
      { step: 'Building', description: '4-8 weeks, with a new version to see every week.' },
      { step: 'Launch and measurement', description: 'The first real users and the data about what works.' },
    ],
    forWho: [
      'founders with an idea validated in conversations, but without a product',
      'companies that want to test a new digital product',
      'startups preparing a funding round',
      'non-technical teams that need a technical partner',
    ],
    faq: [
      {
        question: 'What is an MVP?',
        answer:
          'Minimum Viable Product, the first version of a product, with only the features needed to find out whether people want it and use it.',
      },
      {
        question: 'How much does an MVP cost?',
        answer:
          'It depends on the product, so the quote arrives within 24 hours after the first discussion. We keep the first version small on purpose, so you spend little before you find out whether the idea is worth it.',
      },
      {
        question: 'How long does it take?',
        answer:
          'Usually 4-8 weeks for the first version, with a new version to see every week.',
      },
      {
        question: 'What happens after the MVP?',
        answer:
          'If the data shows the idea is worth it, we continue the development together or we hand over the complete code to your team.',
      },
    ],
    waMessage: 'Hi! I have a startup idea and I need an MVP.',
    serviceType: 'Startup MVP development',
  },
  'sistem-programari-online': {
    name: 'Online booking system',
    shortName: 'Online bookings',
    h1: 'Online booking system for clinics and salons',
    seoTitle: 'Online booking system, from 690 EUR',
    metaDescription:
      'An online booking system on your own website: calendar by specialist, confirmations and reminders by WhatsApp or SMS, no commission per booking. From 690 EUR.',
    answerCapsule:
      'The MAST Studio online booking system puts a calendar directly on your website: the client picks the service, the specialist and the time, and the confirmation and reminders go out automatically by e-mail or WhatsApp. You pay no commission per booking and the data stays yours. It starts at 690 EUR and is ready in 2-3 weeks.',
    priceLabel: 'from 690 EUR',
    deliveryLabel: 'Timeline',
    deliveryTime: '2-3 weeks',
    intro:
      'Booking platforms put you next to your competitors, take a commission and keep your clients’ data. Your own system, on your website, gives you the same advantages without those drawbacks: an online calendar, reminders that reduce no-shows and a client list that stays yours.',
    includes: [
      'an online calendar on your website, by services and specialists',
      'working hours, breaks and time off',
      'automatic confirmations and reminders by e-mail, WhatsApp or SMS',
      'cancellation and rescheduling by the client',
      'an admin panel for you and your team',
      'a client list with the booking history',
      'no commission per booking',
    ],
    notIncluded: [
      'the SMS or WhatsApp Business costs, paid separately',
      'online payment in advance (on request, a separate quote)',
      'integration with an existing medical system (after an analysis)',
    ],
    process: [
      { step: 'You tell us how you work', description: 'Services, durations, specialists, schedule and the cancellation rules.' },
      { step: 'We configure the system', description: 'The calendar, the confirmation messages and the reminders, in your tone.' },
      { step: 'We test with the team', description: 'We make trial bookings until everything runs without a hitch.' },
      { step: 'We launch and train you', description: 'The team knows how to use it from the first day.' },
    ],
    forWho: [
      'medical, dental and veterinary practices',
      'beauty salons and aesthetic clinics',
      'physiotherapists, nutritionists and psychologists',
      'auto services and other appointment-based services',
    ],
    faq: [
      {
        question: 'Why my own system and not a booking platform?',
        answer:
          'Because you pay no commission per booking, the client does not see your competitors next to you, and the client data stays yours.',
      },
      {
        question: 'Do reminders reduce no-shows?',
        answer:
          'Yes, the reminder sent one day before and the possibility to reschedule easily are the most effective ways to reduce missed bookings.',
      },
      {
        question: 'How much does a booking system cost?',
        answer:
          'From 690 EUR for a practice or salon with a single location. The SMS or WhatsApp message costs are separate and small.',
      },
      {
        question: 'Can it be linked to the AI assistant?',
        answer:
          'Yes. The AI assistant can take bookings in a conversation and put them straight into the calendar.',
      },
    ],
    waMessage: 'Hi! I want an online booking system on my website.',
    serviceType: 'Online booking system',
  },
  'design-ux-ui': {
    name: 'UX/UI design',
    shortName: 'UX/UI design',
    h1: 'UX/UI design for apps, platforms and websites',
    seoTitle: 'UX/UI design for apps, from 250 EUR',
    metaDescription:
      'UX/UI design for apps, SaaS platforms and websites: audit from 250 EUR, product design from 1,200 EUR, interactive prototype and developer handover.',
    answerCapsule:
      'At MAST Studio, UX/UI design starts at 250 EUR for an audit of an existing site or app, and at 1,200 EUR for the design of an MVP (up to 12 key screens) in about 2 weeks. You get user flows, wireframes, high-fidelity UI for desktop and mobile, an interactive Figma prototype, a mini design system, and the handoff to your developer.',
    priceLabel: 'from 250 EUR',
    deliveryLabel: 'Delivery time',
    deliveryTime: '3 days (audit) · ~2 weeks (sprint)',
    intro:
      'UX/UI design is for apps, platforms, and SaaS, for redesigns, and for teams that already have a developer but no designer. For a simple presentation website, the design is already included in our “Presentation website” service. Here we work on the product: flows, screens, a prototype, and a design system your developer can follow without guesswork.',
    includes: [
      'a discovery call and a brief',
      'user flows',
      'wireframes',
      'high-fidelity UI for desktop and mobile',
      'an interactive Figma prototype',
      'a mini design system: colours, typography, components with states',
      'an accessibility check (WCAG AA)',
      'developer handoff: Figma Dev Mode, exported assets, a specification',
      '2 rounds of changes',
      '30 days of developer support',
    ],
    notIncluded: [
      'development (quoted separately; if we build it, the design is deducted from the price)',
      'user testing (+300 EUR)',
      'logo and branding',
      'illustrations and 3D',
    ],
    packages: [
      { name: 'UX/UI audit', price: '250 EUR', time: '3 business days', forWho: 'Find out exactly what blocks your users before you invest in a redesign' },
      { name: 'Product design sprint', price: 'from 1,200 EUR', time: '~2 weeks', forWho: 'MVPs and new products that need to launch fast' },
      { name: 'Full product design', price: 'from 2,500 EUR', time: '3–6 weeks', forWho: 'Platforms and products that grow over time' },
      { name: 'Design retainer', price: 'from 600 EUR/month', time: 'monthly', forWho: 'Teams iterating on the product every month' },
    ],
    process: [
      { step: 'Call and brief', description: 'We discuss the product, the users, and which screens matter most. You get a fixed-price quote.' },
      { step: 'Flows and wireframes', description: 'We draw the user journey and the screen structure, before any colour or styling.' },
      { step: 'UI and prototype, with feedback', description: 'High-fidelity design for desktop and mobile, linked into an interactive Figma prototype. We adjust along the way, within the 2 included rounds.' },
      { step: 'Developer handoff', description: 'Figma Dev Mode, exported assets, a specification, and 30 days of support for the team that builds it.' },
    ],
    forWho: [
      'startups building an MVP',
      'SaaS platforms and B2B apps',
      'firms with an app or a website that does not convert',
      'developer teams without a designer',
      'agencies that need design as outsourcing',
    ],
    faq: [
      {
        question: 'How much does UX/UI design cost?',
        answer:
          'We have four packages: the UX/UI audit costs 250 EUR, the product design sprint starts at 1,200 EUR, full product design at 2,500 EUR, and the design retainer at 600 EUR a month.',
      },
      {
        question: 'What is the difference between UX and UI?',
        answer:
          'UX is the flow and the structure: what the user does, in which order, and why. UI is how it looks: colours, typography, components. We do both, in that order.',
      },
      {
        question: 'Do I get the Figma files?',
        answer:
          'Yes. At handover, the Figma files become entirely yours, together with the exported assets and the specification for the developer.',
      },
      {
        question: 'Can you also build it?',
        answer:
          'Yes, with a separate quote for development. If we build the app, the design is deducted from the build price.',
      },
      {
        question: 'How do I pay?',
        answer:
          '50% deposit and 50% at handover. The audit is paid up front and is fully deducted from a design project that follows.',
      },
    ],
    waMessage: 'Hi! I’m interested in UX/UI design for a project. Can we talk?',
    serviceType: 'UX/UI design',
  },
  'site-proiect-finantat': {
    name: 'Website for an EU-funded project',
    shortName: 'EU project website',
    h1: 'Websites for EU-funded projects',
    seoTitle: 'Website for an EU-funded project',
    metaDescription:
      'Websites for EU-funded projects with every mandatory visibility element, results pages and news. Built to programme rules. From 690 EUR, in 7-10 days.',
    answerCapsule:
      'We build websites for EU-funded projects that follow the funder’s visibility rules: mandatory logos and statements, the project code, the funding amount, and pages for objectives, results, team, partners and news. They start at 690 EUR and are ready 7-10 days after we receive the materials.',
    priceLabel: 'from 690 EUR',
    deliveryLabel: 'Timeline',
    deliveryTime: '7-10 days after materials',
    intro:
      'An EU-funded project needs an online presence that follows strict visibility rules and stays up to date for the whole duration of the project. We have built websites like this for biomedical research projects, where we had to speak at the same time to researchers, partners and the funder’s evaluators.',
    includes: [
      'the programme’s mandatory visibility elements, placed correctly',
      'a permanent bar with the project identifiers: SMIS code, beneficiary, funding amount',
      'pages for objectives, activities, results, team and partners',
      'a news and press-release section that is easy to update',
      'a Romanian and an English version, on request',
      'an archive of public documents and reports',
      'a full handover and training for the project team',
    ],
    notIncluded: [
      'writing the mandatory press releases (a separate quote)',
      'hosting and the domain, in the beneficiary’s name',
      'legal verification of compliance with the funding contract',
    ],
    process: [
      { step: 'You send us the contract and the identity manual', description: 'From them we extract exactly which visibility elements your programme requires.' },
      { step: 'We structure the content', description: 'We separate what is for evaluators, what is for partners and what is for the public.' },
      { step: 'We build and verify', description: 'Every mandatory element is ticked off a list before launch.' },
      { step: 'We launch and train you', description: 'The project team can publish the news and results on their own.' },
    ],
    forWho: [
      'beneficiaries of PoCIDIF, PR and PNRR projects',
      'research centres and universities',
      'companies with funded investment projects',
      'NGOs and associations with European projects',
    ],
    faq: [
      {
        question: 'Which visibility elements are mandatory on the website of a funded project?',
        answer:
          'Usually: the programme and European Union logos, the funding statement, the project title and code, the beneficiary, the funding amount and the implementation period. The exact list depends on the programme, and we take it from the funder’s visual identity manual.',
      },
      {
        question: 'Can I pay for the website from the project budget?',
        answer:
          'Often yes, under information and publicity costs. Check your project’s guide and budget; we give you the invoice and the delivery documents you need for reimbursement.',
      },
      {
        question: 'Who updates the website during the project?',
        answer:
          'Your team, after training, or us, through a maintenance plan. The website must stay up to date after the project ends as well, during the sustainability period.',
      },
      {
        question: 'Do you also make the English version?',
        answer:
          'Yes. For projects with international partners we recommend a bilingual website, with the same structure in both languages.',
      },
    ],
    waMessage: 'Hi! I have an EU-funded project and I need a website.',
    serviceType: 'Website for an EU-funded project',
  },
  'refacere-site': {
    name: 'Website redesign',
    shortName: 'Website redesign',
    h1: 'Website redesign for businesses',
    seoTitle: 'Website redesign for businesses',
    metaDescription:
      'We redesign your old website: new design, speed on phones, clear copy and the same page addresses, so you keep your Google rankings. Same price as a new site.',
    answerCapsule:
      'Redesigning a website at MAST Studio costs the same as a new presentation website. We keep what works: the page addresses, your Google rankings and the good content. We rebuild what does not: the design, the speed on phones, the copy and the contact buttons. We redirect every old page correctly, so you do not lose visitors.',
    priceLabel: 'from 300 EUR',
    deliveryLabel: 'Delivery time',
    deliveryTime: '48 hours after materials',
    intro:
      'An old website is not just ugly. It is slow on phones, it no longer says what you do now, and it sends clients to your competitors. But a badly done redesign can also cost you Google rankings won over years. That is why we start from what already works and rebuild the rest.',
    includes: [
      'an analysis of the old website: which pages bring visitors, what works, what does not',
      'a new, unique design',
      'copy rewritten clearly',
      'good speed on phones',
      'a redirect from every old page to its new one',
      'keeping the data in Google Search Console and Analytics',
      'moving you to a domain and a hosting in your name, if you do not have them already',
    ],
    notIncluded: [
      'complex new features (a store, accounts, bookings), quoted separately',
      'migrating hundreds of products or articles without a separate quote',
    ],
    process: [
      { step: 'We analyse the old website', description: 'We see which pages matter for Google and for clients.' },
      { step: 'We propose the new structure', description: 'What we keep, what we merge, what we write again.' },
      { step: 'We build and redirect', description: 'A new website, with every old address sent where it should go.' },
      { step: 'We launch and monitor', description: 'In the first weeks we check that your Google rankings are kept.' },
    ],
    forWho: [
      'businesses with a website older than 4-5 years',
      'websites that are slow on phones',
      'businesses that have changed their services or identity',
      'websites built on themes that break at updates',
    ],
    faq: [
      {
        question: 'Will I lose my Google rankings if I redesign my website?',
        answer:
          'Not if the redesign is done correctly. We keep the important addresses and redirect every old page, then we monitor Search Console in the first weeks after launch.',
      },
      {
        question: 'How much does a website redesign cost?',
        answer:
          'The same as a new presentation website, at the same starting price. If the old website has many pages or special features, the price is set in a quote.',
      },
      {
        question: 'Can you take over a website built by someone else?',
        answer:
          'Yes. We need access to the domain or the help of the previous provider. If the domain is not in your name, we help you transfer it.',
      },
      {
        question: 'Can I keep my old texts?',
        answer:
          'Yes, we keep the good ones. We usually rewrite only what is no longer current or is not clear on phones.',
      },
    ],
    waMessage: 'Hi! I want to redesign my business website.',
    serviceType: 'Website redesign',
  },
  mentenanta: {
    name: 'Maintenance and growth',
    shortName: 'Maintenance',
    h1: 'Website and online store maintenance',
    seoTitle: 'Website maintenance, from 90 EUR/month',
    metaDescription:
      'Website and online store maintenance from 90 EUR a month, no long contract: updates, backups, security, changes. We also take over sites built by others.',
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
      {
        question: 'Do you take over a site built by someone else?',
        answer:
          'Yes. We first run a check of the site, tell you honestly what state it is in, and only then propose a plan. If the domain is not in your name, we help you transfer it.',
      },
    ],
    waMessage: 'Hi! I’m interested in maintenance and growth for my website.',
    serviceType: 'Website maintenance',
  },
  'automatizari-whatsapp': {
    name: 'WhatsApp automation',
    shortName: 'WhatsApp automation',
    h1: 'WhatsApp Business automation for small businesses',
    seoTitle: 'WhatsApp automation for small businesses',
    metaDescription:
      'WhatsApp Business automation from 250 EUR: out-of-hours replies, booking confirmations and reminders. You approve every message, decisions stay with you.',
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
      {
        question: 'When do I need an AI assistant instead of automation?',
        answer:
          'When customer questions are too varied for fixed messages. Automation answers pre-defined scenarios, while an AI assistant holds a conversation from your information.',
      },
    ],
    waMessage: 'Hi! I’m interested in automation and WhatsApp for my business.',
    serviceType: 'WhatsApp automation',
  },
  'asistent-ai': {
    name: 'AI customer assistant',
    shortName: 'AI assistant',
    h1: 'AI assistant for your website and WhatsApp',
    seoTitle: 'AI assistant for website and WhatsApp',
    metaDescription:
      'An AI assistant that answers customers on your website and WhatsApp from your business information, takes bookings and hands over to a person. From 790 EUR.',
    answerCapsule:
      'The MAST Studio AI assistant answers customers on your website and on WhatsApp, day and night, only from information you approve: services, prices, opening hours, policies. It takes enquiries and bookings and hands the conversation to a person when needed. It starts at 790 EUR, plus monthly running costs set out in the quote.',
    priceLabel: 'from 790 EUR',
    deliveryLabel: 'Timeline',
    deliveryTime: '2-3 weeks',
    intro:
      'Your customers ask the same questions at all hours, and anyone who waits more than a few minutes moves on to the next business. A well-built AI assistant answers at once, correctly and in your tone, because it only knows what you taught it. It does not invent prices, does not promise things you do not do and leaves the important decisions to you.',
    includes: [
      'analysis of the questions you get most often',
      'a knowledge base built from your business information: services, prices, hours, policies, FAQ',
      'an assistant on your website and, on request, on WhatsApp Business',
      'collecting quote requests and bookings',
      'handover to a person, with the full conversation history',
      'a clear notice that the person is talking to an AI assistant',
      'testing on real questions before launch',
      'a monthly report of the questions received and the answers given',
    ],
    notIncluded: [
      'the monthly costs of the AI model and WhatsApp Business, paid separately and shown upfront',
      'medical, legal or financial advice given by AI in place of a specialist',
      'complex ERP or CRM integrations (separate quote)',
    ],
    process: [
      { step: 'We collect what the assistant must know', description: 'Your frequent questions, prices, hours and rules. Anything not written down here, the assistant will not say.' },
      { step: 'We build and train the knowledge base', description: 'The assistant answers only from approved sources and says "I don\'t know, let me connect you with a colleague" when it has no answer.' },
      { step: 'We test it with your real questions', description: 'We put dozens of questions to it, including the hard ones, and correct it until it answers the way you would.' },
      { step: 'We launch and monitor', description: 'It goes live on your site and WhatsApp, and in the first month we review conversations and adjust the answers.' },
    ],
    forWho: [
      'medical, dental and veterinary practices with many repetitive questions',
      'salons and clinics that take bookings',
      'online stores with questions about products, delivery and returns',
      'service businesses that get quote requests after hours',
    ],
    faq: [
      {
        question: 'What is an AI customer assistant?',
        answer:
          "A program that understands the questions customers type and answers in natural language, from your business information. Unlike a button-based chatbot, it also understands questions phrased in everyone's own way.",
      },
      {
        question: 'Can it make up answers or prices?',
        answer:
          'We build it to answer only from information you approve. When it does not know, it says so and passes the conversation to a person. We test exactly this before launch.',
      },
      {
        question: 'How much does an AI assistant cost?',
        answer:
          'The build starts at 790 EUR. Separately, you pay the monthly cost of the AI model and, if you use it, WhatsApp Business. Both depend on the number of conversations and are estimated in the quote.',
      },
      {
        question: 'Does it comply with GDPR and European AI rules?',
        answer:
          'Yes. Customers are told from the start that they are talking to an AI assistant, as European rules require, data is processed only for the conversation, and your privacy policy is updated accordingly.',
      },
      {
        question: 'How is it different from WhatsApp automation?',
        answer:
          'WhatsApp automation sends fixed, pre-written messages. The AI assistant holds a conversation: it understands the question and writes the answer from your information. Many businesses start with automation and move to the assistant later.',
      },
    ],
    waMessage: 'Hi! I am interested in an AI customer assistant for my website and WhatsApp.',
    serviceType: 'AI customer assistant',
  },
  'automatizari-ai': {
    name: 'AI process automation',
    shortName: 'AI automation',
    h1: 'AI automation for your business processes',
    seoTitle: 'AI automation for businesses, from 990 EUR',
    metaDescription:
      'AI automation for documents, quotes, emails and reports: it takes over repetitive work for your team while a person approves what matters. From 990 EUR.',
    answerCapsule:
      'MAST Studio AI automation takes over repetitive work in your business: it reads and sorts emails, extracts data from invoices and documents, and prepares quotes and reports. It starts at 990 EUR per process, and a person on your team approves every important step.',
    priceLabel: 'from 990 EUR',
    deliveryLabel: 'Timeline',
    deliveryTime: '2-4 weeks, depending on the process',
    intro:
      'Almost every business loses hours every week on the same things: copying data from one document to another, answering similar emails, making the same quote with different numbers. AI now does these things well and fast. We pick the process that eats most of your time, automate it, and keep people where judgement is needed.',
    includes: [
      'process analysis and an estimate of time saved, before we start',
      'automation of one complete process, end to end',
      'data extraction from documents, invoices, PDFs and emails',
      'quotes, reports and replies generated from your templates',
      'connection to the tools you already use: email, Google Workspace, Excel, CRM',
      'a human approval step for important decisions',
      'documentation and team training',
    ],
    notIncluded: [
      'the monthly costs of AI models and third-party services, estimated in the quote',
      'automating several processes at once (each one is quoted separately)',
      'decisions taken by AI without human control in sensitive areas',
    ],
    process: [
      { step: 'We choose the process', description: 'You show us how you work today. We pick the process that wastes the most time and estimate how many hours a month it can save.' },
      { step: 'We build a first version', description: 'In the first week you see the automation working on real examples from your business.' },
      { step: 'We test on real data', description: 'We run it alongside your current way of working and correct it until the results are reliable.' },
      { step: 'We hand over and train', description: 'Your team gets the documentation, knows how to check the results and what to do when something is off.' },
    ],
    forWho: [
      'accounting firms and offices that handle many documents',
      'distribution and manufacturing companies that send many quotes',
      'practices and clinics with heavy admin',
      'sales and support teams answering similar emails',
    ],
    faq: [
      {
        question: 'Which processes can be automated with AI?',
        answer:
          'Any repetitive process based on text or documents: sorting emails, extracting data from invoices and contracts, preparing quotes, meeting summaries, periodic reports, standard replies. We start with the ones that save the most time.',
      },
      {
        question: 'How much does AI automation cost?',
        answer:
          'It starts at 990 EUR per process. The final price depends on the number of steps, data sources and integrations. Monthly AI model costs are separate and estimated in the quote.',
      },
      {
        question: 'Is my company data safe?',
        answer:
          'We only work with AI providers that do not use your data for training, limit access to what is strictly needed and document the processing for GDPR.',
      },
      {
        question: 'Does AI replace employees?',
        answer:
          'No. It takes over the repetitive part, and people stay on what needs judgement: approval, customer relationships, decisions. The goal is to give your team time for the work that matters.',
      },
      {
        question: 'I do not know what to automate. Where do I start?',
        answer:
          'With an AI audit: in 7-10 days we show you which processes are worth automating, how much time you save and in what order. The audit fee is deducted from the first implementation.',
      },
    ],
    waMessage: 'Hi! I want to automate a process in my business with AI. Can we talk?',
    serviceType: 'AI process automation',
  },
  'solutii-ai-personalizate': {
    name: 'Custom AI solutions',
    shortName: 'Custom AI',
    h1: 'Custom AI solution development',
    seoTitle: 'Custom AI solution development',
    metaDescription:
      'We build AI solutions on your data: image recognition, data analysis, personalised recommendations and AI built into your apps. Quote within 24 hours.',
    answerCapsule:
      'MAST Studio builds custom artificial intelligence solutions: image recognition, analysis of complex data, personalised recommendations and AI built into existing applications. We have built systems for drone surveillance, personalised nutrition and medical research. The quote arrives within 24 hours of the first conversation.',
    priceLabel: 'quote within 24 hours',
    deliveryLabel: 'Timeline',
    deliveryTime: 'in stages, set out in the quote',
    intro:
      'Some problems cannot be solved with an off-the-shelf tool. You have your own data, a unique process or a product idea where AI is the core, not an add-on. For these projects we build the solution from scratch, in stages, with a working first version early and with architecture, security and data decisions made by people.',
    includes: [
      'technical discovery: what data you have, what the system must do, what is realistic',
      'image and document recognition (computer vision)',
      'data analysis and personalised recommendation models',
      'AI models integrated into existing apps, platforms and workflows',
      'dashboards and real-time data visualisation',
      'security and data protection designed in from the start',
      'build in stages, with access to progress',
      'code, data and accounts in your name, full documentation',
    ],
    notIncluded: [
      'accuracy promises before testing on your data',
      'specialised hardware (drones, sensors, servers), if the project needs it',
      'model and infrastructure running costs, estimated in the quote',
    ],
    process: [
      { step: 'Discovery conversation', description: 'We understand the problem, the data and the constraints. You get a quote with stages and a price within 24 hours.' },
      { step: 'Proof of concept', description: 'We test the idea on your real data, so we know what accuracy is possible before the big investment.' },
      { step: 'Build in stages', description: 'Every stage ends with something you can use and test, not with a report.' },
      { step: 'Launch and handover', description: 'The system goes into use, and you receive the code, the documentation and team training.' },
    ],
    forWho: [
      'companies with their own data that they want to turn into decisions',
      'clinics and research centres',
      'startups building an AI-based product',
      'EU-funded projects that include an artificial intelligence component',
    ],
    faq: [
      {
        question: 'What kind of AI solutions have you built?',
        answer:
          'A drone command centre that maps ragweed around Timișoara, a platform that analyses microbiome data for personalised nutrition, a tool that recognises nutritional values from a photo and a secure clinical management and research platform.',
      },
      {
        question: 'How much does a custom AI solution cost?',
        answer:
          'It depends on the data, the complexity and the integrations, so we quote after the first conversation, within 24 hours. We recommend starting with a proof of concept, so you know what works before the big investment.',
      },
      {
        question: 'Do I need a lot of data?',
        answer:
          'Not always. Current AI models can do a lot with few examples, and where more data is needed we help you collect it properly. The honest answer comes after we see your data.',
      },
      {
        question: 'Can these projects be funded with EU money?',
        answer:
          'Yes, many digitalisation and research programmes fund artificial intelligence components. The quote and stage plan you get from us can be used in the application documents.',
      },
      {
        question: 'Who owns the solution at the end?',
        answer:
          "You do. The code, data and accounts are in your company's name, and the documentation lets you continue with any team.",
      },
    ],
    waMessage: 'Hi! I have an idea for an artificial intelligence project. Can we talk?',
    serviceType: 'Custom AI development',
  },
  'audit-strategie-ai': {
    name: 'AI audit and strategy',
    shortName: 'AI audit',
    h1: 'AI audit and strategy for businesses',
    seoTitle: 'AI audit and strategy, from 490 EUR',
    metaDescription:
      'An AI audit for businesses: we find where AI saves you time and money, what risks you face and in what order to implement. From 490 EUR, in 7-10 days.',
    answerCapsule:
      'The MAST Studio AI audit shows you, in 7-10 days, where artificial intelligence can save time and money in your business, what data and compliance risks you have and in what order each step is worth implementing. It costs from 490 EUR, and the fee is deducted from the first implementation you do with us.',
    priceLabel: 'from 490 EUR',
    deliveryLabel: 'Timeline',
    deliveryTime: '7-10 days',
    intro:
      'Everyone talks about AI, but few business owners know where to start or what is really worth it. The audit gives a concrete answer: we look at how your business works, measure where time is lost and give you a plan with 3-5 opportunities, with costs, estimated savings and risks, not a presentation about the future.',
    includes: [
      'short interviews with the people who do the work',
      'a map of the repetitive processes in your business',
      '3-5 AI opportunities, ranked by time saved and effort',
      'a cost and savings estimate for each',
      'a risk check: personal data, GDPR, European AI rules',
      'tool recommendations, with their real prices',
      'a 90-day implementation plan',
      'a one-hour presentation and discussion with management',
    ],
    notIncluded: [
      'the implementation itself (quoted separately, with the audit fee deducted)',
      'legal advice (compliance recommendations do not replace a lawyer)',
    ],
    process: [
      { step: 'Kick-off conversation', description: 'We learn what the business does, where you feel time is lost and what you have tried already.' },
      { step: 'On-site analysis', description: 'We talk to the people who do the work and look at the documents and tools they use.' },
      { step: 'The plan', description: 'You get the report with opportunities, costs, savings and risks, in plain language.' },
      { step: 'Presentation and next steps', description: 'We discuss it together. If you want us to implement, the audit fee is deducted from the first stage.' },
    ],
    forWho: [
      'owners who want to understand what AI can concretely do for their business',
      'companies with 5-100 employees and a lot of admin work',
      'teams already using ChatGPT, but without rules or a plan',
      'companies preparing a funding application for digitalisation',
    ],
    faq: [
      {
        question: 'What exactly do I get from the AI audit?',
        answer:
          'A report with 3-5 opportunities ranked by impact, with cost and time-saving estimates, data and compliance risks and a 90-day plan. Plus a one-hour discussion where we go through it together.',
      },
      {
        question: 'How much does an AI audit cost?',
        answer:
          'From 490 EUR for a small company with one department. If you choose to implement with us, the fee is deducted from the first stage.',
      },
      {
        question: 'Do I need to know anything about AI beforehand?',
        answer:
          'No. The audit is made precisely for people who do not have time to follow everything new. We explain everything in business terms, not technical ones.',
      },
      {
        question: 'What do the European AI rules mean for my business?',
        answer:
          'For most small businesses the obligations are simple: people must be told when they are talking to an AI, and personal data must be processed under GDPR. In the audit we check exactly what applies to you.',
      },
      {
        question: 'Does the audit help with a funding application?',
        answer:
          'Yes. The digitalisation plan from the audit, with costs and steps, is a good basis for a digitalisation funding application.',
      },
    ],
    waMessage: 'Hi! I am interested in an AI audit for my business.',
    serviceType: 'AI consulting and strategy',
  },
  'vizibilitate-ai': {
    name: 'Visibility in ChatGPT and AI search',
    shortName: 'AI visibility',
    h1: 'Visibility in ChatGPT, Gemini and AI search',
    seoTitle: 'Get recommended by ChatGPT: AI visibility',
    metaDescription:
      'We prepare your business to be recommended by ChatGPT, Gemini and Google AI: Google profile, directories, structured data and clear content. From 390 EUR.',
    answerCapsule:
      'More and more customers ask ChatGPT or Gemini for recommendations instead of Google. The MAST Studio AI visibility service prepares your business to appear in these answers: a complete Google profile, presence in directories, structured data on your site and content AI can quote. It starts at 390 EUR and takes 10 days.',
    priceLabel: 'from 390 EUR',
    deliveryLabel: 'Timeline',
    deliveryTime: '10 days',
    intro:
      'When we asked ChatGPT for the best dentist, vet or lawyer in Timișoara, 90% of the businesses it recommended had their own website, but the sources it cited were mostly Google Maps, directories and review sites. So AI learns about you from everything the internet says about you, not only from your site. We put all those places in order, so you are easy to find and easy to recommend.',
    includes: [
      'a starting test: what ChatGPT, Gemini and Perplexity say about you and your competitors',
      'Google Business Profile optimisation',
      'listing and corrections in the directories that matter for your field',
      'identical details everywhere: name, address, phone, hours',
      'structured data on your site (schema.org) and an llms.txt file',
      'pages and answers written so AI can quote them',
      'a plan for steady reviews',
      'a final report and a new test after 30 days',
    ],
    notIncluded: [
      'a guarantee that you will be recommended (no one can honestly give one)',
      'fake or bought reviews',
      'a full rebuild of your site (separate quote if needed)',
    ],
    process: [
      { step: 'The starting test', description: 'We ask AI assistants the questions your customers ask and note who appears and where the information comes from.' },
      { step: 'We fix your sources', description: 'Google profile, directories, identical contact details everywhere.' },
      { step: 'We optimise your site', description: 'Structured data, clear answers to customer questions and content that is easy to quote.' },
      { step: 'We test again', description: 'After 30 days we repeat the test and show you what changed.' },
    ],
    forWho: [
      'local businesses: practices, clinics, salons, restaurants, trades',
      'professional services: lawyers, accountants, consultants',
      'online stores that want to appear in product recommendations',
      'anyone who has heard a customer say "I found you on ChatGPT"',
    ],
    faq: [
      {
        question: 'What is GEO (generative engine optimisation)?',
        answer:
          'GEO means preparing information about your business so AI assistants such as ChatGPT, Gemini or Google AI Overviews can find it, understand it and cite it when someone asks for a recommendation.',
      },
      {
        question: 'Can you guarantee ChatGPT will recommend me?',
        answer:
          'No, and anyone who guarantees it is not telling the truth. We can make you present, accurate and consistent in all the sources AI draws on, and the 30-day test shows exactly what changed.',
      },
      {
        question: 'How is it different from SEO?',
        answer:
          "SEO helps you appear in Google's list of results. GEO helps you appear in the answer an AI writes. They work together: much of what helps one helps the other.",
      },
      {
        question: 'Where do AI assistants get information about local businesses?',
        answer:
          'In our Timișoara test, ChatGPT most often cited Google Maps, business directories, review sites and "best of" articles. Businesses\' own sites were cited directly only rarely, but almost every recommended business had one.',
      },
      {
        question: 'How much does it cost and how long does it take?',
        answer:
          'From 390 EUR, in about 10 days, plus the check-up test after 30 days. Monthly monitoring can be added to a maintenance plan.',
      },
    ],
    waMessage: 'Hi! I want to appear in ChatGPT and Google AI recommendations.',
    serviceType: 'Generative engine optimisation (GEO)',
  },
  'training-ai': {
    name: 'AI training for teams',
    shortName: 'AI training',
    h1: 'AI training for teams and businesses',
    seoTitle: 'AI training for teams, from 450 EUR',
    metaDescription:
      'A hands-on AI workshop for teams: ChatGPT, Claude and Gemini used properly, on your real tasks, with clear rules for data. From 450 EUR per workshop.',
    answerCapsule:
      'MAST Studio AI training is a hands-on half-day workshop, at your office or online, for up to 12 people. Your team learns to use ChatGPT, Claude and Gemini on its real tasks, to check what AI produces and which data must never go into it. It costs from 450 EUR per workshop.',
    priceLabel: 'from 450 EUR per workshop',
    deliveryLabel: 'Duration',
    deliveryTime: 'half a day, at your office or online',
    intro:
      'Your team probably already uses AI, each person in their own way, some well, some riskily. A good workshop turns individual habits into company practice: the same tools, the same data rules, prompts that actually work on your work, not generic internet examples.',
    includes: [
      "a conversation beforehand, so exercises use the team's real tasks",
      'a hands-on half-day workshop for up to 12 participants',
      'ChatGPT, Claude and Gemini: when to use each',
      'writing good prompts and checking the results',
      'safety rules: which data never goes into AI',
      'a prompt library for your company, to use after the workshop',
      'a short internal AI use policy, ready to adopt',
    ],
    notIncluded: ['subscriptions to AI tools', 'an official accredited certificate'],
    process: [
      { step: 'We learn what the team does', description: 'A short conversation about daily tasks, so the workshop examples are about your work.' },
      { step: 'We prepare the workshop', description: 'Exercises, prompts and rules adapted to your field.' },
      { step: 'The workshop', description: 'Four hands-on hours: each participant works on their own laptop, on real tasks.' },
      { step: 'After the workshop', description: 'You receive the prompt library and the internal policy. We answer questions for two more weeks.' },
    ],
    forWho: [
      'office, sales, marketing and support teams',
      'companies that want clear rules before AI is used everywhere',
      'practices and clinics that work with sensitive data',
      'associations and chambers of commerce running training for members',
    ],
    faq: [
      {
        question: 'Who is the AI training for?',
        answer:
          'Any team that works at a computer: office, sales, marketing, support, admin. No technical knowledge is needed, just a laptop and everyday tasks.',
      },
      {
        question: 'Which AI tools do we learn?',
        answer:
          'ChatGPT, Claude and Gemini, with a focus on what each does best. If your company already uses a specific tool, we build the workshop around it.',
      },
      {
        question: 'How much does AI training cost?',
        answer:
          'From 450 EUR for a half-day workshop with up to 12 participants, online or in Timișoara. Travel costs are added for other cities.',
      },
      {
        question: 'My team already uses ChatGPT. Is it still worth it?',
        answer:
          'Yes, usually even more so. The workshop brings shared data rules, result checking and prompts that save real time, not just curiosity.',
      },
      {
        question: 'Can the training be funded?',
        answer:
          'Many digitalisation programmes also fund staff training. We give you every document you need: agenda, duration, participants and invoice.',
      },
    ],
    waMessage: 'Hi! I am interested in AI training for my team.',
    serviceType: 'AI training for teams',
  },
  'seo-local': {
    name: 'Local SEO and Google Business',
    shortName: 'Local SEO',
    h1: 'Local SEO and Google Business Profile',
    seoTitle: 'Local SEO and Google Business, 150 EUR/mo',
    metaDescription:
      'Local SEO for businesses in your city: a well-kept Google Business Profile, reviews, local pages and a monthly report. From 150 EUR a month, no long contract.',
    answerCapsule:
      'Local SEO at MAST Studio means your business appears when someone searches for your service in your city: a well-kept Google Business Profile, monthly posts, replies to reviews, local pages on your site and a monthly report. From 150 EUR a month, with no long-term contract.',
    priceLabel: 'from 150 EUR a month',
    deliveryLabel: 'Contract',
    deliveryTime: 'monthly, no long contract',
    intro:
      'When someone searches for a dentist in their city or a plumber near them, the first three results on the map take almost all the calls. That spot is not bought, it is earned month by month: a complete profile, steady reviews, correct information everywhere and a site that says clearly what you do and where.',
    includes: [
      'a complete Google Business Profile setup',
      'monthly posts on the profile',
      'replies to reviews, written together with you',
      'a plan for a steady flow of new reviews',
      'local pages on your site, for the areas you serve',
      'identical data across directories',
      'a monthly report: calls, visits, rankings',
    ],
    notIncluded: [
      'the paid ads budget',
      'fake or bought reviews',
      'a guarantee of the first spot',
    ],
    process: [
      { step: 'Local audit', description: 'We see where you appear today, how you stand against competitors and what the profile is missing.' },
      { step: 'We set the base right', description: 'A complete profile, correct data everywhere, local pages on your site.' },
      { step: 'We work monthly', description: 'Posts, reviews, adjustments.' },
      { step: 'Monthly report', description: 'The real numbers: calls, visits, direction requests, rankings.' },
    ],
    forWho: [
      'clinics, practices and salons',
      'tradespeople and home-service companies',
      'restaurants and cafés',
      'law and accounting firms',
    ],
    faq: [
      {
        question: 'What is local SEO?',
        answer:
          'Everything that makes a business appear in location-based searches, on Google Maps and in the pack of three results on the map: the Google Profile, reviews, contact details and the local pages on your site.',
      },
      {
        question: 'How long until I see results?',
        answer:
          'The first changes usually appear within 4-8 weeks, depending on the competition in your field and how complete the profile was at the start.',
      },
      {
        question: 'Can I cancel at any time?',
        answer:
          'Yes. The plan is monthly, with no long-term contract. Everything we built stays yours.',
      },
    ],
    waMessage: 'Hi! I want to show up higher on Google Maps in my city.',
    serviceType: 'Local SEO and Google Business Profile',
  },
  'campanii-reclame': {
    name: 'Google and Meta ad campaigns',
    shortName: 'Ad campaigns',
    h1: 'Google Ads and Meta Ads campaigns',
    seoTitle: 'Google Ads and Meta campaigns, from 250 EUR',
    metaDescription:
      'Google Ads, Facebook and Instagram campaigns for small businesses: controlled budget, tested ads, monthly reports with real customers. From 250 EUR a month.',
    answerCapsule:
      'We manage the Google Ads, Facebook and Instagram campaigns of your business from 250 EUR a month, plus the ad budget, paid directly by you to the platforms. We measure what matters: messages, calls and real requests, not just clicks, and the monthly report shows what each new customer costs you.',
    priceLabel: 'from 250 EUR a month + ad budget',
    deliveryLabel: 'Contract',
    deliveryTime: 'monthly, no long contract',
    intro:
      'Ads can bring customers fast or burn money just as fast. The difference is made by the page people land on, the message, the audience chosen and correct measurement. We build the campaign together with the landing page, test several variants and quickly stop what does not work.',
    includes: [
      'campaign strategy and audience selection',
      'measurement setup: calls, WhatsApp, forms',
      'ad copy and visuals',
      'testing several variants',
      'weekly optimisation',
      'a monthly report with the cost per new customer',
    ],
    notIncluded: [
      'the ad budget, paid directly to Google and Meta',
      'complex video production',
      'guaranteed sales promises',
    ],
    process: [
      { step: 'We set the goal', description: 'What a result means for you: a call, a booking, an order.' },
      { step: 'We prepare the campaign', description: 'Measurement, landing page, messages and audience.' },
      { step: 'We launch and test', description: 'Several variants, a small budget at first, then we scale what works.' },
      { step: 'Monthly report', description: 'What you spent, how many customers came and what each one cost.' },
    ],
    forWho: [
      'local businesses that want new customers fast',
      'online stores',
      'clinics and practices (following medical advertising rules)',
      'academies and courses with enrolments',
    ],
    faq: [
      {
        question: 'What ad budget do I need?',
        answer:
          'For a local business, usually from 30-50 lei a day to start. We set it together and increase it only when we see results.',
      },
      {
        question: 'Do I pay the budget through you?',
        answer:
          'No. The budget is paid directly by you to Google and Meta, from your own account. We only receive the management fee.',
      },
      {
        question: 'Can I cancel at any time?',
        answer:
          'Yes. The plan is monthly, and the ad accounts stay yours, with all their history.',
      },
    ],
    waMessage: 'Hi! I want Google or Meta campaigns for my business.',
    serviceType: 'Google Ads and Meta Ads management',
  },
  'continut-seo': {
    name: 'Monthly SEO content',
    shortName: 'SEO content',
    h1: 'Blog articles and monthly SEO content',
    seoTitle: 'Monthly SEO content and blog articles',
    metaDescription:
      'Blog articles and pages written for what your customers search, checked by a person, with real data and internal links. From 240 EUR a month, 4 articles.',
    answerCapsule:
      'The MAST Studio SEO content service brings you 4 new articles or pages every month, written for the questions your customers search on Google and ask AI assistants. We use AI for speed, but every text is checked by a person, with real data and links to your services. It starts at 240 EUR a month.',
    priceLabel: 'from 240 EUR a month',
    deliveryLabel: 'Contract',
    deliveryTime: 'monthly, no long contract',
    intro:
      'A blog nobody writes brings nothing. A blog with generic articles, written just to exist, brings even less. We write little and well: concrete answers to your customers’ real questions, with verified figures and a clear next step towards your services.',
    includes: [
      'a monthly topic plan, based on what your customers search',
      '4 new articles or pages a month',
      'every text checked and edited by a person',
      'verified figures and sources, no invented information',
      'internal links to your services and pages',
      'images for every article',
      'publishing directly on your website',
      'a monthly report: what was published and what traffic it brings',
    ],
    notIncluded: [
      'sponsored articles on other websites',
      'texts published without your check, if you want to approve them',
      'translations into other languages (separate)',
    ],
    process: [
      { step: 'Topic plan', description: 'We find the questions your customers search and that nobody answers well.' },
      { step: 'We write', description: 'AI for speed, a person for the checking, the tone and the figures.' },
      { step: 'You approve and we publish', description: 'You see every article first, if you want.' },
      { step: 'We measure', description: 'A monthly report with the traffic and the topics worth continuing.' },
    ],
    forWho: [
      'companies with a website, but no time to write',
      'practices and clinics that want to answer patients’ questions',
      'online stores that want traffic from Google',
      'professional services firms',
    ],
    faq: [
      {
        question: 'Do you write the articles with AI?',
        answer:
          'We use AI for research and a first draft, but every article is checked, edited and completed by a person, with real figures and sources. We do not publish generated texts nobody has seen.',
      },
      {
        question: 'How long until the articles bring traffic?',
        answer:
          'Usually 2-4 months for the first visible results, depending on the field and on how strong the website is.',
      },
      {
        question: 'Can I cancel at any time?',
        answer:
          'Yes, the subscription is monthly. The published articles stay yours.',
      },
      {
        question: 'Can I choose the topics?',
        answer:
          'Yes. We propose a monthly plan, and you add, remove or change topics before we write.',
      },
    ],
    waMessage: 'Hi! I am interested in monthly SEO content for my website.',
    serviceType: 'SEO content and blog articles',
  },
}
