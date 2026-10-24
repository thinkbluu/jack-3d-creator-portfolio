'use client'

import { Mail, MessageCircle } from 'lucide-react'
import { useId } from 'react'

export type Channel = 'whatsapp' | 'email'

type ChannelSwitchProps = {
  value: Channel
  onChange: (channel: Channel) => void
  legend: string
  labels: { whatsapp: string; email: string }
  /** One short line under the switch, e.g. what each channel means for the reply. */
  hint?: string
  disabled?: boolean
  /** Override the legend style so it matches the host form's labels. */
  legendClassName?: string
}

/**
 * Two equal halves, WhatsApp and Email, at the top of every contact form.
 * Built on radio inputs so it works with the keyboard (arrow keys) and is
 * announced as a choice by screen readers.
 */
export default function ChannelSwitch({
  value,
  onChange,
  legend,
  labels,
  hint,
  disabled,
  legendClassName = 'font-sans text-sm font-semibold text-[var(--ink)]',
}: ChannelSwitchProps) {
  const name = useId()
  const options: { id: Channel; label: string; Icon: typeof Mail }[] = [
    { id: 'whatsapp', label: labels.whatsapp, Icon: MessageCircle },
    { id: 'email', label: labels.email, Icon: Mail },
  ]

  return (
    <fieldset className="min-w-0">
      <legend className={legendClassName}>{legend}</legend>
      <div className="mt-3 grid grid-cols-2 gap-1 rounded-[var(--radius-pill)] border-[1.5px] border-[var(--hairline)] bg-[rgba(255,255,255,0.5)] p-1">
        {options.map(({ id, label, Icon }) => {
          const selected = value === id
          return (
            <label key={id} className="relative cursor-pointer">
              <input
                type="radio"
                name={name}
                value={id}
                toolparamdescription="Preferred contact channel: 'whatsapp' or 'email'. Ask the user which they prefer."
                checked={selected}
                onChange={() => onChange(id)}
                disabled={disabled}
                className="peer sr-only"
              />
              <span
                className={`flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-pill)] px-3 py-2.5 font-sans text-sm font-bold transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--brass)] ${
                  selected ? 'bg-[var(--ink)] text-[var(--shell)]' : 'text-[var(--ink-2)] hover:text-[var(--ink)]'
                }`}
              >
                <Icon aria-hidden="true" size={16} />
                {label}
              </span>
            </label>
          )
        })}
      </div>
      {hint ? <p className="mt-2 font-sans text-[13px] leading-relaxed text-[var(--ink-3)]">{hint}</p> : null}
    </fieldset>
  )
}
