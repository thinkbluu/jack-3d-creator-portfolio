import { ContestRulesView, contestRulesMetadata } from '@/app/(ro)/site-gratuit/regulament/page'

export const metadata = contestRulesMetadata('en')

export default function Page() {
  return <ContestRulesView locale="en" />
}
