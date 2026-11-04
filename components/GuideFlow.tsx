'use client'

import { useEffect, useRef, useState } from 'react'

import { trackConversion } from '@/lib/analytics'
import { whatsappUrl } from '@/lib/site'

import GuideRadioGroup from './GuideRadioGroup'
import GuideResult, { type GuideResultCopy, type GuideResultIndustry, type GuideResultProps, type GuideResultService } from './GuideResult'

export type GuideFlowOption = { id: string; label: string }
export type GuideFlowQuestion = { id: string; prompt: string; options: GuideFlowOption[] }

export type GuideFlowProps = {
  copy: {
    progressTemplate: string
    back: string
    next: string
    whatsappTemplate: string
    industryPrompt: string
    andSeparator: string
    resultAnnouncement: string
    otherSummary: string
  }
  goalQuestion: GuideFlowQuestion
  branches: Record<string, GuideFlowQuestion>
  industryOptions: GuideFlowOption[]
  /** `${goal}:${follow}` → service slugs, from lib/guide. */
  paths: Record<string, string[]>
  servicesById: Record<string, GuideResultService>
  industriesById: Record<string, GuideResultIndustry>
  summaries: { goal: Record<string, string>; follow: Record<string, string>; industry: Record<string, string> }
  otherId: string
  resultCopy: GuideResultCopy
  restartHref: string
  /** The server-rendered no-JS form, hidden once the flow takes over. */
  formId: string
}

const TOTAL_STEPS = 3

/** "A, B și C" — a list that reads naturally inside a sentence. Kept local so the client bundle does not pull in lib/guide (and the whole catalog). */
function joinNatural(items: string[], separator: string): string {
  if (items.length <= 1) return items.join('')
  return `${items.slice(0, -1).join(', ')}${separator}${items[items.length - 1]}`
}

/**
 * The interactive guide: one question per screen, progress bar, back button.
 * Renders nothing until mounted so the no-JS fallback form stays visible and
 * functional without JavaScript; on mount it hides that form and takes over.
 */
export default function GuideFlow(props: GuideFlowProps) {
  const [mounted, setMounted] = useState(false)
  const [step, setStep] = useState(0)
  const [goal, setGoal] = useState<string | null>(null)
  const [follow, setFollow] = useState<string | null>(null)
  const [industry, setIndustry] = useState<string | null>(null)
  const [result, setResult] = useState<GuideResultProps | null>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const interactedRef = useRef(false)

  useEffect(() => {
    setMounted(true)
    document.getElementById(props.formId)?.setAttribute('hidden', '')
  }, [props.formId])

  // Move focus to each new question heading (and to the result heading), but
  // never steal focus on the initial page load.
  useEffect(() => {
    if (interactedRef.current) headingRef.current?.focus()
  }, [step, result])

  if (!mounted) return null

  const branch = goal ? props.branches[goal] : null
  const question: GuideFlowQuestion =
    step === 0 ? props.goalQuestion : step === 1 && branch ? branch : { id: 'industry', prompt: props.copy.industryPrompt, options: props.industryOptions }
  const selected = step === 0 ? goal : step === 1 ? follow : industry

  function select(id: string) {
    if (step === 0) {
      setGoal(id)
      setFollow(null)
    } else if (step === 1) {
      setFollow(id)
    } else {
      setIndustry(id)
    }
  }

  function next() {
    interactedRef.current = true
    if (step === 0 && goal) setStep(1)
    else if (step === 1 && follow) setStep(2)
    else if (step === 2 && industry) finish()
  }

  function back() {
    interactedRef.current = true
    if (result) {
      setResult(null)
      setStep(TOTAL_STEPS - 1)
      return
    }
    setStep((current) => Math.max(0, current - 1))
  }

  function finish() {
    if (!goal || !follow || !industry) return
    const slugs = props.paths[`${goal}:${follow}`] ?? []
    const services = slugs.map((slug) => props.servicesById[slug]).filter(Boolean)
    if (services.length === 0) return
    const industryEntry = industry === props.otherId ? null : (props.industriesById[industry] ?? null)
    const a1 = props.summaries.goal[goal] ?? goal
    const a2 = props.summaries.follow[follow] ?? follow
    const a3 = industry === props.otherId ? props.copy.otherSummary : (props.summaries.industry[industry] ?? '')
    const servicesText = joinNatural(
      services.map((service) => service.name),
      props.copy.andSeparator,
    )
    const message = props.copy.whatsappTemplate
      .replace('{a1}', a1)
      .replace('{a2}', a2)
      .replace('{a3}', a3)
      .replace('{services}', servicesText)

    trackConversion('guide_result', { service: slugs[0], industry })

    setResult({
      services,
      industry: industryEntry,
      whatsappHref: whatsappUrl(message),
      copy: props.resultCopy,
    })
  }

  const progress = props.copy.progressTemplate.replace('{step}', String(step + 1)).replace('{total}', String(TOTAL_STEPS))
  const announcement = result
    ? props.copy.resultAnnouncement.replace(
        '{services}',
        joinNatural(result.services.map((service) => service.name), props.copy.andSeparator),
      )
    : ''

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between gap-4">
        <p className="mono-label text-[var(--fg-3)]">{progress}</p>
        <div className="flex gap-1.5" aria-hidden="true">
          {Array.from({ length: TOTAL_STEPS }, (_, index) => (
            <span key={index} className={`h-1 w-10 ${!result && index <= step ? 'bg-[var(--accent)]' : 'bg-[var(--hairline)]'}`} />
          ))}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>

      {(step > 0 || result) && (
        <button
          type="button"
          onClick={back}
          className="self-start font-sans text-sm font-semibold text-[var(--fg-2)] underline underline-offset-4 transition-colors hover:text-[var(--ink)]"
        >
          <span aria-hidden="true">← </span>
          {props.copy.back}
        </button>
      )}

      {result ? (
        <GuideResult {...result} headingRef={headingRef} />
      ) : (
        <div className="flex flex-col gap-8">
          <GuideRadioGroup
            prompt={question.prompt}
            name={question.id}
            options={question.options}
            checkedId={selected ?? undefined}
            onChange={select}
            headingRef={headingRef}
          />
          <button
            type="button"
            onClick={next}
            disabled={!selected}
            className="self-start bg-[var(--brass-lite)] px-6 py-3.5 font-sans text-sm font-bold text-[var(--night)] transition-[background-color,opacity] hover:bg-[#faf7f2] disabled:cursor-not-allowed disabled:opacity-40"
            style={{ borderRadius: 'var(--radius-pill)' }}
          >
            {props.copy.next} <span aria-hidden="true">→</span>
          </button>
        </div>
      )}
    </div>
  )
}
