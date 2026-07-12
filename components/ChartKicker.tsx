interface ChartKickerProps {
  bearing: string
  label: string
  paper?: boolean
  coords?: boolean
}

export default function ChartKicker({ bearing, label, paper = false, coords = false }: ChartKickerProps) {
  return (
    <div
      className={`mb-4 flex w-full items-center justify-between gap-6 ${paper ? 'text-[rgba(10,18,32,0.38)]' : 'text-[var(--text-3)]'}`}
    >
      <p className="text-[0.65rem] font-medium uppercase tracking-[0.2em]">
        BRG {bearing} · {label}
      </p>
      <p className="hidden text-right text-[0.65rem] font-medium uppercase tracking-[0.2em] md:block">
        45.75° N · 21.23° E
      </p>
    </div>
  )
}
