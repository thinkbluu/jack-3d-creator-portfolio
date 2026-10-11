import { getTeam } from '@/lib/team'
import { teamMemberMetadata, TeamMemberView } from '@/app/(ro)/echipa/[nume]/view'

type Props = { params: Promise<{ nume: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return getTeam().map((member) => ({ nume: member.slug }))
}

export async function generateMetadata({ params }: Props) {
  return teamMemberMetadata('en', (await params).nume)
}

export default async function TeamMemberPage({ params }: Props) {
  return <TeamMemberView locale="en" slug={(await params).nume} />
}
