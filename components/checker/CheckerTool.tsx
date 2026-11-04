'use client'

import { useEffect, useRef, useState } from 'react'

import TrackedLink from '@/components/TrackedLink'
import { fill, type CheckerCopy } from '@/lib/checker/copy'
import { CATEGORY_KEYS, type CategoryResult, type SiteReport } from '@/lib/checker/types'

export type ServiceLink = { slug: string; name: string; priceLabel: string; href: string }

type Props = {
  locale: 'ro' | 'en'
  copy: CheckerCopy
  privacyHref: string
  whatsappHref: string
  services: ServiceLink[]
}

const STATUS_COLOR: Record<string, string> = {
  pass: '#1F6B44',
  warn: '#8A5A00',
  fail: '#B23A2E',
  error: '#6b6663',
}

const VERDICT_COLOR: Record<string, string> = {
  good: '#1F6B44',
  fair: '#8A5A00',
  poor: '#B23A2E',
  unverified: '#6b6663',
}

type Phase = 'idle' | 'checking' | 'done' | 'error'

export default function CheckerTool({ locale, copy, privacyHref, whatsappHref, services }: Props) {
  const [url, setUrl] = useState('')
  const [phase, setPhase] = useState<Phase>('idle')
  const [step, setStep] = useState(0)
  const [report, setReport] = useState<SiteReport | null>(null)
  const [errorText, setErrorText] = useState('')
  const resultRef = useRef<HTMLDivElement>(null)

  // /verifica-site?url=... pre-fills the input; the check still starts only
  // when the visitor presses the button, never on page load.
  useEffect(() => {
    const prefill = new URLSearchParams(window.location.search).get('url')
    if (prefill) setUrl(prefill.trim().slice(0, 200))
  }, [])

  // Progress: name each check as it (appears to) run. The server runs them in
  // parallel; the visible sequence is an honest progress indicator, not a log.
  useEffect(() => {
    if (phase !== 'checking') return
    const timer = window.setInterval(() => {
      setStep((current) => Math.min(current + 1, CATEGORY_KEYS.length - 1))
    }, 2200)
    return () => window.clearInterval(timer)
  }, [phase])

  async function runCheck(event: React.FormEvent) {
    event.preventDefault()
    if (phase === 'checking') return
    setPhase('checking')
    setStep(0)
    setReport(null)
    setErrorText('')
    try {
      const response = await fetch('/api/check-site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, locale }),
      })
      const data = (await response.json()) as { ok: boolean; report?: SiteReport; error?: string }
      if (!response.ok || !data.ok || !data.report) {
        setErrorText(data.error ?? copy.ui.errorGeneric)
        setPhase('error')
        return
      }
      setReport(data.report)
      setPhase('done')
      window.setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60)
    } catch {
      setErrorText(copy.ui.errorGeneric)
      setPhase('error')
    }
  }

  const matchedServices = report ? services.filter((service) => report.recommendedSlugs.includes(service.slug)) : []
  const whatsappMessage = report
    ? `${whatsappHref}${whatsappHref.includes('?') ? '&' : '?'}text=${encodeURIComponent(
        locale === 'ro'
          ? `Bună! Am verificat site-ul ${report.url} cu verificatorul vostru gratuit. Scor: ${report.overall ?? 'n/a'}/100. Vreau să discutăm rezultatele.`
          : `Hi! I checked ${report.url} with your free website checker. Score: ${report.overall ?? 'n/a'}/100. I'd like to discuss the results.`,
      )}`
    : whatsappHref

  return (
    <div className="checker-tool">
      <form onSubmit={runCheck} className="checker-form" noValidate>
        <label className="contact-field checker-url-field">
          <span className="mono-label">{copy.ui.urlLabel}</span>
          <input
            type="text"
            name="url"
            inputMode="url"
            autoComplete="url"
            placeholder={copy.ui.urlPlaceholder}
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            disabled={phase === 'checking'}
            required
          />
        </label>
        <button type="submit" className="contact-submit mono-label" disabled={phase === 'checking'}>
          {phase === 'checking' ? copy.ui.checking : copy.ui.submit}
        </button>
      </form>

      <div aria-live="polite" className="sr-only">
        {phase === 'checking' ? `${copy.ui.progressTitle}: ${copy.categories[CATEGORY_KEYS[step]].name}` : ''}
      </div>

      {phase === 'checking' && (
        <div className="checker-progress" role="status">
          <p className="mono-label text-[var(--ink-3)]">{copy.ui.progressTitle}</p>
          <ol>
            {CATEGORY_KEYS.map((key, index) => (
              <li key={key} data-state={index < step ? 'done' : index === step ? 'running' : 'pending'}>
                <span className="checker-progress-dot" aria-hidden="true" />
                {copy.categories[key].name}
              </li>
            ))}
          </ol>
        </div>
      )}

      {phase === 'error' && (
        <p className="checker-error" role="alert">
          {errorText}
        </p>
      )}

      {phase === 'done' && report && (
        <div className="checker-result" ref={resultRef}>
          <header className="checker-result-head">
            <p className="mono-label text-[var(--ink-3)]">
              {copy.ui.resultTitle} {copy.ui.resultFor} {report.url}
            </p>
            <div className="checker-score">
              <span className="checker-score-number">{report.overall ?? '—'}</span>
              <span className="checker-score-of">
                {copy.overallOf}
                <br />
                {copy.overallLabel}
              </span>
            </div>
            <p className="mono-label text-[var(--ink-3)]">{copy.verdictIntro}</p>
          </header>

          <ul className="checker-categories">
            {report.categories.map((category) => (
              <CategoryCard key={category.key} category={category} copy={copy} />
            ))}
          </ul>

          {report.fixes.length > 0 && (
            <section className="checker-fixes">
              <h3 className="type-h3">{copy.fixesTitle}</h3>
              <p className="text-[var(--ink-3)]">{copy.fixesIntro}</p>
              <ol>
                {report.fixes.map((fix, index) => (
                  <li key={`${fix.id}-${index}`} className="checker-fix">
                    <h4 className="type-h4">{`${index + 1}. ${fix.title}`}</h4>
                    <p>
                      <span className="mono-label">{copy.ui.what}</span> {fix.what}
                    </p>
                    <p>
                      <span className="mono-label">{copy.ui.why}</span> {fix.why}
                    </p>
                    <p>
                      <span className="mono-label">{copy.ui.who}</span> {fix.who}
                    </p>
                  </li>
                ))}
              </ol>
              <p className="text-[var(--ink-3)]">
                {fill(copy.ui.pdfLine, {
                  n: report.categories.flatMap((category) => category.sub).filter((entry) => entry.status === 'fail' || entry.status === 'warn').length,
                })}
              </p>
            </section>
          )}

          <EmailReportForm copy={copy} locale={locale} report={report} privacyHref={privacyHref} />

          <section className="checker-next">
            <h3 className="type-h3">{copy.ui.fixTitle}</h3>
            <p className="text-[var(--ink-3)]">{copy.ui.fixIntro}</p>
            <TrackedLink
              eventName="whatsapp_click"
              eventProperties={{ source: 'website-checker' }}
              href={whatsappMessage}
              target="_blank"
              rel="noopener noreferrer"
              className="checker-whatsapp mono-label"
            >
              {copy.ui.whatsappCta}
            </TrackedLink>
            {matchedServices.length > 0 && (
              <div className="checker-services">
                <h4 className="mono-label">{copy.ui.servicesTitle}</h4>
                <ul>
                  {matchedServices.map((service) => (
                    <li key={service.slug}>
                      <a href={service.href}>
                        <span>{service.name}</span>
                        <span className="mono-label text-[var(--ink-3)]">{service.priceLabel}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          <button type="button" className="checker-again mono-label" onClick={() => { setPhase('idle'); setReport(null); setUrl('') }}>
            {copy.ui.again}
          </button>
        </div>
      )}
    </div>
  )
}

function CategoryCard({ category, copy }: { category: CategoryResult; copy: CheckerCopy }) {
  const meta = copy.categories[category.key]
  const color = VERDICT_COLOR[category.verdict]
  const verdictLabel = category.score === null ? copy.verdicts.unverified : copy.verdicts[category.verdict]
  return (
    <li className="checker-category">
      <header>
        <h4 className="type-h4">{meta.name}</h4>
        <p className="checker-category-score" style={{ color }}>
          <span>{category.score === null ? '—' : category.score}</span>
          <span className="mono-label">{verdictLabel}</span>
        </p>
      </header>
      {meta.note && <p className="mono-label text-[var(--ink-3)]">{meta.note}</p>}
      <ul>
        {category.sub.map((entry) => (
          <li key={entry.id} style={{ ['--dot' as string]: STATUS_COLOR[entry.status] }}>
            <span className="checker-dot" aria-hidden="true" />
            <span>{entry.status === 'error' ? copy.unverified : entry.label}</span>
          </li>
        ))}
      </ul>
      {category.metrics && (
        <p className="checker-metrics text-[var(--ink-3)]">
          {category.metrics.lcp && (
            <>
              {copy.speedMetrics.lcp}: <strong>{category.metrics.lcp}</strong>.{' '}
            </>
          )}
          {category.metrics.cls && (
            <>
              {copy.speedMetrics.cls}: <strong>{category.metrics.cls}</strong>.
            </>
          )}
        </p>
      )}
    </li>
  )
}

function EmailReportForm({ copy, locale, report, privacyHref }: { copy: CheckerCopy; locale: 'ro' | 'en'; report: SiteReport; privacyHref: string }) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorText, setErrorText] = useState('')

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (state === 'sending') return
    const form = new FormData(event.currentTarget)
    setState('sending')
    setErrorText('')
    try {
      const response = await fetch('/api/check-site-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: report.url,
          locale,
          name: form.get('name'),
          email: form.get('email'),
          phone: form.get('phone'),
          consent: form.get('consent') === 'on',
          website: form.get('website'),
          report,
        }),
      })
      const data = (await response.json()) as { ok: boolean; error?: string }
      if (!response.ok || !data.ok) {
        setErrorText(data.error ?? copy.ui.reportError)
        setState('error')
        return
      }
      setState('sent')
    } catch {
      setErrorText(copy.ui.reportError)
      setState('error')
    }
  }

  if (state === 'sent') {
    return (
      <section className="checker-email" aria-live="polite">
        <h3 className="type-h3">{copy.ui.emailTitle}</h3>
        <p className="checker-sent">{copy.ui.reportSent}</p>
      </section>
    )
  }

  return (
    <section className="checker-email">
      <h3 className="type-h3">{copy.ui.emailTitle}</h3>
      <p className="text-[var(--ink-3)]">{copy.ui.emailIntro}</p>
      <form onSubmit={submit} noValidate>
        {/* Honeypot: hidden from people, filled by bots. */}
        <div className="hp-field" aria-hidden="true">
          <label>
            Website
            <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <label className="contact-field">
          <span className="mono-label">{copy.ui.nameLabel}</span>
          <input type="text" name="name" autoComplete="name" required minLength={2} maxLength={120} />
        </label>
        <label className="contact-field">
          <span className="mono-label">{copy.ui.emailLabel}</span>
          <input type="email" name="email" autoComplete="email" required maxLength={254} />
        </label>
        <label className="contact-field">
          <span className="mono-label">{copy.ui.phoneLabel}</span>
          <input type="tel" name="phone" autoComplete="tel" maxLength={40} />
        </label>
        <label className="checker-consent">
          <input type="checkbox" name="consent" defaultChecked={false} />
          <span>{copy.ui.consentLabel}</span>
        </label>
        <p className="mono-label text-[var(--ink-3)]">
          {copy.ui.privacyNoticeBefore} <a href={privacyHref}>{copy.ui.privacyNoticeLink}</a>.
        </p>
        {state === 'error' && (
          <p className="checker-error" role="alert">
            {errorText}
          </p>
        )}
        <button type="submit" className="contact-submit mono-label" disabled={state === 'sending'}>
          {state === 'sending' ? copy.ui.sendingReport : copy.ui.sendReport}
        </button>
      </form>
    </section>
  )
}
