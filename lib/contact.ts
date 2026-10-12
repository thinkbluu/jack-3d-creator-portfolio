/** Topics on the contact form. Labels live with each locale's copy. */
export const CONTACT_TOPICS = ['project', 'question', 'press', 'other'] as const
export type ContactTopic = (typeof CONTACT_TOPICS)[number]
