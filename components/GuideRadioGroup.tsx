import type { RefObject } from 'react'

type GuideRadioGroupProps = {
  prompt: string
  name: string
  options: Array<{ id: string; label: string }>
  /** Controlled selection (JavaScript flow). */
  checkedId?: string
  /** Uncontrolled initial selection (no-JS form, preserves a partial submit). */
  defaultCheckedId?: string
  onChange?: (id: string) => void
  /** Receives the question heading so the flow can move focus to it. */
  headingRef?: RefObject<HTMLHeadingElement | null>
}

/**
 * One guide question as a radio group: real fieldset/legend semantics, big
 * full-width tap targets, native keyboard behaviour (arrows inside the group).
 * Shared by the one-question-per-screen flow and the no-JS fallback form.
 */
export default function GuideRadioGroup({ prompt, name, options, checkedId, defaultCheckedId, onChange, headingRef }: GuideRadioGroupProps) {
  // Keyed on the handler, not on checkedId: the flow passes `selected ?? undefined`,
  // which is undefined before the first pick but must still be controlled.
  const controlled = onChange !== undefined
  return (
    <fieldset className="min-w-0">
      <legend className="block max-w-full">
        <h2 ref={headingRef} tabIndex={-1} className="type-h2 text-balance focus-visible:outline-none">
          {prompt}
        </h2>
      </legend>
      <div className="mt-6 flex flex-col">
        {options.map((option, index) => (
          <label
            key={option.id}
            className="group -outline-offset-2 flex cursor-pointer items-baseline gap-4 border-t border-[var(--hairline)] py-5 last:border-b has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-[var(--brass)]"
          >
            <input
              type="radio"
              name={name}
              value={option.id}
              className="peer sr-only"
              {...(controlled
                ? { checked: checkedId === option.id, onChange: onChange ? () => onChange(option.id) : undefined }
                : { defaultChecked: defaultCheckedId === option.id })}
            />
            <span className="mono-label shrink-0 text-[var(--fg-3)]">{String(index + 1).padStart(2, '0')}</span>
            <span className="font-sans text-base font-semibold text-[var(--ink)] transition-colors group-hover:text-[var(--brass-ink)] peer-checked:text-[var(--accent)]">
              {option.label}
            </span>
            <span
              aria-hidden="true"
              className="ml-auto h-3 w-3 shrink-0 self-center rounded-full border border-[var(--fg-3)] peer-checked:border-[var(--accent)] peer-checked:bg-[var(--accent)]"
            />
          </label>
        ))}
      </div>
    </fieldset>
  )
}
