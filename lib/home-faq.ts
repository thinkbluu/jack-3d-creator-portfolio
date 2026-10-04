import type { Locale } from './i18n/locale'
import { homeFaqGroupKickersEn, homeFaqsEn } from './i18n/content/home-faq.en'

// Homepage FAQ. Shared by the accordion (client) and the FAQPage structured data (server).

export const homeFaqs: Array<[string, string]> = [
  [
    'Cât costă un site în România, concret?',
    'La noi prețurile sunt la vedere: site de prezentare de la 300 EUR, magazin online de la 900 EUR, aplicații și platforme cu ofertă personalizată în 24h. Avansul e 50 EUR și se scade din preț. Fără costuri ascunse: îți spunem de la început și cât costă domeniul și găzduirea, orientativ 50-120 EUR pe an, plătite direct de tine, pe numele tău.',
  ],
  [
    'Site de prezentare sau magazin online, ce mi se potrivește?',
    'Simplu: dacă vrei ca oamenii să te găsească, să aibă încredere și să te contacteze, îți trebuie site de prezentare. Dacă vrei să plătească produse direct pe site, cu cardul, îți trebuie magazin online. Dacă nu ești sigur, ne scrii pe WhatsApp și îți spunem sincer, chiar dacă răspunsul e varianta mai ieftină.',
  ],
  [
    'Chiar e gata în 48 de ore?',
    'Da, pentru site-uri de prezentare de până la 5 pagini. Cronometrul pornește când avem materialele complete de la tine, ghidate de lista noastră scurtă. Magazinele online au nevoie de 7 zile. Termenul e scris în contract, nu spus din vârful buzelor.',
  ],
  [
    'Ce trebuie să vă dau eu ca să începem?',
    'Puțin: sigla dacă ai, câteva poze, informațiile de bază despre afacere și lista de servicii sau produse cu prețuri. Primești de la noi o listă clară cu tot ce ne trebuie, iar ce lipsește rezolvăm împreună.',
  ],
  [
    'Cine scrie textele și cine face designul?',
    'Noi, și e inclus în preț. Tu ne dai informațiile brute, noi le transformăm în texte care conving și într-un design făcut doar pentru tine. Tu doar aprobi.',
  ],
  [
    'Ce se întâmplă dacă nu îmi place rezultatul?',
    'Vezi site-ul finalizat, live, înainte să plătești restul. Prima rundă de modificări e inclusă. Dacă nici după aceea nu ne întâlnim, te oprești: rămâi doar cu avansul de 50 EUR, păstrezi analiza și direcția făcute pentru afacerea ta, iar site-ul rămâne la noi. Riscul mare e la noi, nu la tine.',
  ],
  [
    'Site-ul e al meu sau rămân legat de voi?',
    'E al tău, cu totul: domeniul se cumpără pe numele firmei tale, accesele îți aparțin, iar dacă vreodată vrei să pleci, pleci cu tot. Nu credem în clienți ținuți captivi.',
  ],
  [
    'De ce nu folosiți teme WordPress, ca alții?',
    'Pentru că temele de-a gata vin cu balast: sunt lente, seamănă între ele și se strică la actualizări. Noi construim site-ul de la zero, doar cu ce îți trebuie ție. De-asta putem garanta viteza și de-asta site-ul tău nu arată ca al concurenței.',
  ],
  [
    'De ce contează atât de mult viteza site-ului?',
    'Pentru că oamenii nu așteaptă: dacă site-ul se încarcă greu pe telefon, pleacă în câteva secunde, iar Google te coboară în căutări. Site-urile noastre se deschid instant, garantat la predare, și asta se vede direct în numărul de clienți care rămân.',
  ],
  [
    'Merită să plătesc mentenanță lunară?',
    'Dacă vrei doar ca site-ul să existe, nu neapărat. Dacă vrei să urce în Google, să fie mereu sigur și actualizat și să ai pe cineva care răspunde când vrei o modificare, da. De la 90 EUR pe lună, fără contract pe termen lung: renunți oricând.',
  ],
  [
    'Faceți și aplicații sau platforme mai complexe?',
    'Da, de la aplicații interne care îți scutesc ore de muncă repetitivă până la platforme complete cu conturi și abonamente. Ne spui ideea pe WhatsApp și primești în 24h o părere sinceră: ce merită construit, cât durează și cât costă.',
  ],
  [
    'Cum îmi dau seama dacă o firmă de web design e serioasă?',
    'Cere trei lucruri: preț clar înainte să pornești, termen scris în contract și dovada că vezi rezultatul înainte de plata finală. Dacă primești răspunsuri vagi la oricare, mergi mai departe. Noi le punem pe toate trei pe masă din primul mesaj.',
  ],
]

// Groups reference `homeFaqs` by index, so the source list stays the single
// source of truth for both the UI and the FAQPage structured data.
export const homeFaqGroups: Array<{ kicker: string; indices: number[] }> = [
  { kicker: 'Bani și termene', indices: [5, 0, 1, 2, 9] },
  { kicker: 'Cum lucrăm', indices: [3, 4] },
  { kicker: 'Tehnic și proprietate', indices: [6, 7, 8, 10, 11] },
]

const groupIndices = homeFaqGroups.map((group) => group.indices)

export function getHomeFaqs(locale: Locale = 'ro') {
  return locale === 'en' ? homeFaqsEn : homeFaqs
}

export function getHomeFaqGroups(locale: Locale = 'ro') {
  const kickers = locale === 'en' ? homeFaqGroupKickersEn : homeFaqGroups.map((group) => group.kicker)
  return groupIndices.map((indices, index) => ({ kicker: kickers[index], indices }))
}

