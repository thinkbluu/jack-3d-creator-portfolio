import { portfolioMetadata, PortfolioView } from '@/app/(ro)/portofoliu/view'

export const metadata = portfolioMetadata('en')

export default function Page() {
  return <PortfolioView locale="en" />
}
