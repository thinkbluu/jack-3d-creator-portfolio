import type { JobOpening } from '@/lib/careers'

type JobText = Pick<JobOpening, 'seoTitle' | 'description' | 'summary' | 'responsibilities' | 'requirements' | 'niceToHave'>

export const jobTextEn: Record<string, JobText> = {
  'front-end-developer': {
    seoTitle: 'Front-end developer (React), remote Romania',
    description:
      'We are hiring a front-end developer with 2–3 years of experience in React and Next.js. 7,500–9,000 RON net a month, 8 hours a day, remote, from Romania.',
    summary:
      'You build presentation websites, online stores, and fast, accessible web apps for small businesses in Romania, from design to launch.',
    responsibilities: [
      'turn the design into React and Next.js pages, thought of for the phone first',
      'keep the sites fast, accessible, and well optimised for Google',
      'integrate forms, payments, WhatsApp, and external services',
      'work directly with the designer and, when needed, with the client',
    ],
    requirements: [
      '2–3 years of experience with React, TypeScript, and modern CSS (ideally Tailwind)',
      'live projects or public code you can show us',
      'attention to detail: speed, accessibility, technical SEO',
      'working Romanian',
    ],
    niceToHave: ['Next.js App Router', 'animation with Framer Motion', 'experience with online stores'],
  },
  'mobile-app-developer': {
    seoTitle: 'Mobile app developer (React Native), remote',
    description:
      'We are hiring a mobile app developer with 2–3 years of experience in React Native. 8,000–10,000 RON net a month, 8 hours a day, remote, from Romania.',
    summary:
      'You build mobile apps for iOS and Android, from client portals to bookings and internal tools, for businesses in Romania.',
    responsibilities: [
      'develop apps for iOS and Android from a single codebase',
      'connect the apps to APIs, payments, and notifications',
      'publish and update the apps in the App Store and Google Play',
      'work in short stages, with progress the client can test',
    ],
    requirements: [
      '2–3 years of experience with React Native (or Flutter) and TypeScript',
      'at least one app published in the App Store or Google Play',
      'a solid understanding of performance and the experience on a phone',
      'working Romanian',
    ],
    niceToHave: ['Expo', 'experience with Next.js for the web side', 'push notifications and in-app payments'],
  },
}

export const careerLabelsEn = {
  schedule: 'Full time, 8 hours a day',
  contract: 'Employment contract or collaboration (PFA/SRL)',
  location: 'Remote, from Romania',
  areas: ['Web design', 'Copy and content', 'Marketing and sales', 'Something else'],
  salarySuffix: 'RON net / month',
}
