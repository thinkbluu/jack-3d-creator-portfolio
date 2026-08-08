interface ChartKickerProps {
  label: string
}

export default function ChartKicker({ label }: ChartKickerProps) {
  return <p className="kicker mb-4">{label}</p>
}
