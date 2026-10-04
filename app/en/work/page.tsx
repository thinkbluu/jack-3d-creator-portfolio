import { portfolioMetadata, PortfolioView } from '@/app/(ro)/portofoliu/page'

export const metadata = portfolioMetadata('en')

export default function Page() {
  return <PortfolioView locale="en" />
}
