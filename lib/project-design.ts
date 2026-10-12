import type { Locale } from './i18n/locale'

export type DesignNote = { label: string; text: string }
export type Swatch = { name: string; hex: string }

type ProjectDesign = {
  /** The design decisions, in the order a visitor meets them. */
  notes: DesignNote[]
  /** Optional colour palette. Add the real values from the project files. */
  palette?: Swatch[]
  /** Optional typefaces, as named in the project ("Fraunces, DM Sans"). */
  type?: string
}

/**
 * What each case study is about: the design choices (layout, type, colour,
 * hierarchy, interaction), not results. Every note restates a decision
 * already described in the project's solution text; add palettes and
 * typefaces from the source files when they are at hand.
 */
const design: Record<string, Record<Locale, ProjectDesign>> = {
  'veterinaria-timisoara': {
    ro: {
      notes: [
        { label: 'Ierarhia', text: 'Primul ecran răspunde la trei întrebări: ce servicii sunt, unde e cabinetul și cum ajungi repede la un medic. Programul și urgențele non-stop stau lângă titlu.' },
        { label: 'Layout', text: 'Butoanele de programare și de apel direct rămân la îndemână pe toată lungimea paginii, nu doar sus.' },
        { label: 'Mobil întâi', text: 'Pagina a fost desenată întâi pe telefon, unde se fac cele mai multe căutări de acest fel, adesea în grabă.' },
      ],
    },
    en: {
      notes: [
        { label: 'Hierarchy', text: 'The first screen answers three questions: which services, where the practice is, and how to reach a vet fast. The hours and the round-the-clock emergencies sit next to the title.' },
        { label: 'Layout', text: 'The booking and direct-call buttons stay within reach the whole length of the page, not only at the top.' },
        { label: 'Mobile first', text: 'The page was drawn on a phone first, where most searches of this kind happen, often in a hurry.' },
      ],
    },
  },
  'agd-innerpath-consulting': {
    ro: {
      notes: [
        { label: 'Paleta', text: 'Bleumarin profund și accente aurii: autoritate și discreție, fără aerul unei agenții de marketing.' },
        { label: 'Tipografia', text: 'Titluri cu serif, pentru tonul așezat al unei consultanțe de nivel înalt.' },
        { label: 'Imaginea', text: 'O fotografie de portret ca ancoră de încredere, în locul ilustrațiilor generice.' },
        { label: 'Structura', text: 'Pagina urmează o conversație de business: cine suntem, ce ne ghidează, unde lucrăm, cine e echipa. Cifrele cheie stau imediat sub titlu, ca dovadă înaintea argumentului.' },
        { label: 'Două limbi', text: 'Același site, identic în română și engleză, pentru clienții internaționali.' },
      ],
    },
    en: {
      notes: [
        { label: 'Palette', text: 'Deep navy and gold accents: authority and discretion, without the feel of a marketing agency.' },
        { label: 'Type', text: 'Serif headings, for the settled tone of a high-level consultancy.' },
        { label: 'Imagery', text: 'A portrait photograph as an anchor of trust, instead of generic illustrations.' },
        { label: 'Structure', text: 'The page follows a business conversation: who we are, what guides us, where we work, who the team is. The key figures sit right under the title, as proof before the argument.' },
        { label: 'Two languages', text: 'The same site, identical in Romanian and English, for international clients.' },
      ],
    },
  },
  decodex: {
    ro: {
      notes: [
        { label: 'Direcția vizuală', text: 'Imagistică celulară și accente magenta pe fond întunecat: cercetare de vârf, fără să devină aridă.' },
        { label: 'Bara de finanțare', text: 'Identificatorii obligatorii ai finanțării stau permanent în bara de sus, cum cer regulile de vizibilitate PoCIDIF, fără să încarce pagina.' },
        { label: 'Arhitectura', text: 'Conținutul științific e împărțit în secțiuni care se pot citi separat, fiecare cu limbajul publicului ei.' },
      ],
    },
    en: {
      notes: [
        { label: 'Visual direction', text: 'Cellular imagery and magenta accents on a dark ground: advanced research, without becoming arid.' },
        { label: 'Funding bar', text: 'The mandatory funding identifiers live permanently in the top bar, as the PoCIDIF visibility rules require, without weighing the page down.' },
        { label: 'Architecture', text: 'The scientific content is split into sections that read on their own, each in the language of its audience.' },
      ],
    },
  },
  oncogen: {
    ro: {
      notes: [
        { label: 'Arhitectura', text: 'Intrări multiple, cercetare, proiecte, colaborări, biotehnologii și noutăți, ca fiecare public să ajungă în două clicuri unde are nevoie.' },
        { label: 'Ritmul', text: 'O bară de știri în partea de sus ține site-ul viu și arată activitatea curentă a centrului.' },
        { label: 'Ierarhia', text: 'Acreditările și certificările sunt la un clic din primul ecran, pentru că sunt argumentul principal în fața partenerilor.' },
      ],
    },
    en: {
      notes: [
        { label: 'Architecture', text: 'Several ways in, research, projects, collaborations, biotech and news, so every audience reaches what it needs in two clicks.' },
        { label: 'Rhythm', text: 'A news bar at the top keeps the site alive and shows what the centre is working on now.' },
        { label: 'Hierarchy', text: 'Accreditations and certifications are one click from the first screen, because they are the main argument with partners.' },
      ],
    },
  },
  'painea-casei': {
    ro: {
      notes: [
        { label: 'Un singur scop', text: 'Pagina e construită în jurul unei singure acțiuni: descărcarea catalogului.' },
        { label: 'Ierarhia', text: 'Cifrele care contează pentru un brutar, cuptoare produse, anii producătorului, vechimea în România, stau imediat sub titlu.' },
        { label: 'Catalogul', text: 'Produsele sunt așezate pe categorii, cu specificații clare, iar contactul rămâne în bara de sus pe toată pagina.' },
      ],
    },
    en: {
      notes: [
        { label: 'One purpose', text: 'The page is built around a single action: downloading the catalogue.' },
        { label: 'Hierarchy', text: 'The figures that matter to a baker, ovens built, the maker’s years, the years in Romania, sit right under the title.' },
        { label: 'Catalogue', text: 'Products are set out by category with clear specifications, and the contact stays in the top bar the whole way down.' },
      ],
    },
  },
  asesor: {
    ro: {
      notes: [
        { label: 'Reducție', text: 'Doar ce îi trebuie unui salon mic și mediu: calendar, fișe de client, echipă, stocuri și venituri. Nimic în plus.' },
        { label: 'Interfața', text: 'Gândită pentru telefon, între doi clienți, nu pentru biroul din spate.' },
      ],
    },
    en: {
      notes: [
        { label: 'Reduction', text: 'Only what a small or mid-sized salon needs: calendar, client records, team, stock and revenue. Nothing more.' },
        { label: 'Interface', text: 'Designed for a phone, between two clients, not for the back office.' },
      ],
    },
  },
  lumora: {
    ro: {
      notes: [
        { label: 'Atmosfera', text: 'O singură imagine la scară completă, cu tipografie mare și aerisită peste ea.' },
        { label: 'Contrastul', text: 'Textul rămâne lizibil peste fundal datorită unui strat de contrast calculat, nu unui panou opac.' },
        { label: 'Formularul', text: 'Un singur câmp, chiar în primul ecran, iar ambianța se schimbă din patru variante fără reîncărcare.' },
      ],
    },
    en: {
      notes: [
        { label: 'Atmosphere', text: 'One full-scale image, with large, airy type over it.' },
        { label: 'Contrast', text: 'The text stays readable over the image thanks to a calculated contrast layer, not an opaque panel.' },
        { label: 'The form', text: 'A single field, right on the first screen, and the ambience switches between four variants without a reload.' },
      ],
    },
  },
  mostar: {
    ro: {
      notes: [
        { label: 'Adâncimea', text: 'Straturile imaginii se mișcă independent pe scroll, pentru adâncime reală, nu parallax decorativ.' },
        { label: 'Ritmul', text: 'Textul apare în ritmul mișcării, iar trecerea între secțiuni păstrează continuitatea.' },
        { label: 'Două limbi', text: 'Pagina se schimbă instant între limbi, fără să piardă locul.' },
      ],
    },
    en: {
      notes: [
        { label: 'Depth', text: 'The layers of the image move independently on scroll, for real depth rather than decorative parallax.' },
        { label: 'Rhythm', text: 'The text arrives in time with the motion, and the move between sections keeps its continuity.' },
        { label: 'Two languages', text: 'The page switches language instantly, without losing its place.' },
      ],
    },
  },
  lithos: {
    ro: {
      notes: [
        { label: 'Interacțiunea', text: 'O a doua imagine se descoperă printr-o mască circulară care urmărește cursorul, cu netezire ca să nu sacadeze.' },
        { label: 'Navigarea', text: 'Toată navigarea stă într-o singură pastilă centrală.' },
        { label: 'Fără cursor', text: 'Pe ecranele tactile interacțiunea se oprește elegant, iar pagina rămâne completă.' },
      ],
    },
    en: {
      notes: [
        { label: 'Interaction', text: 'A second image is revealed through a circular mask that follows the cursor, smoothed so it never stutters.' },
        { label: 'Navigation', text: 'All the navigation sits in a single central pill.' },
        { label: 'No cursor', text: 'On touch screens the interaction steps aside gracefully and the page stays complete.' },
      ],
    },
  },
}

export function getProjectDesign(slug: string, locale: Locale = 'ro'): ProjectDesign | null {
  return design[slug]?.[locale] ?? null
}
