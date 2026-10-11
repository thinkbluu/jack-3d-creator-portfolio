import { portfolioMetadata, PortfolioView } from './view'

export const metadata = portfolioMetadata('ro')

export default function Page() {
  return <PortfolioView locale="ro" />
}
