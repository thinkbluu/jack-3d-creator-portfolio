import { getTeam } from '@/lib/team'
import { teamMemberMetadata, TeamMemberView } from './view'

type Props = { params: Promise<{ nume: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return getTeam().map((member) => ({ nume: member.slug }))
}

export async function generateMetadata({ params }: Props) {
  return teamMemberMetadata('ro', (await params).nume)
}

export default async function TeamMemberPage({ params }: Props) {
  return <TeamMemberView locale="ro" slug={(await params).nume} />
}
