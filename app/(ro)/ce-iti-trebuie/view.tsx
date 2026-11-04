import type { Metadata } from 'next'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import SiteHeader from '@/components/SiteHeader'
import PageOpen from '@/components/studio/PageOpen'
import GuideFlow, { type GuideFlowOption } from '@/components/GuideFlow'
import GuideRadioGroup from '@/components/GuideRadioGroup'
import GuideResult, { type GuideResultProps } from '@/components/GuideResult'
import {
  guideBranches,
  guideCopy,
  guideGoalQuestion,
  GUIDE_INDUSTRY_SLUGS,
  GUIDE_OTHER_ID,
  GUIDE_PATHS,
  joinNatural,
  resolveGuide,
  type GuideAnswers,
} from '@/lib/guide'
import { getAllIndustries, getIndustryBySlug } from '@/lib/industries'
import type { Locale } from '@/lib/i18n/locale'
import { localizePath } from '@/lib/i18n/paths'
import { ui } from '@/lib/i18n/ui'
import { PAGE_WORDS } from '@/lib/page-words'
import { getServicePageBySlug } from '@/lib/services'
import { breadcrumbNode, graph, webPageNode, type BreadcrumbItem } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { whatsappUrl } from '@/lib/site'

export function guideMetadata(locale: Locale): Metadata {
  const copy = guideCopy[locale]
  return pageMetadata({
    title: copy.seoTitle,
    description: copy.metaDescription,
    path: localizePath('/ce-iti-trebuie', locale),
    locale,
  })
}

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

/** Query params → answers. Each follow-up question posts under its own branch name. */
function readAnswers(searchParams: Record<string, string | string[] | undefined>): GuideAnswers {
  const follow = Object.values(guideBranches.ro)
    .map((branch) => firstParam(searchParams[`q2-${branch.id}`]))
    .find((value) => value !== undefined)
  return {
    goal: firstParam(searchParams.q1),
    follow,
    industry: firstParam(searchParams.q3),
  }
}

/** "domeniul clinici medicale" — the phrase that fits inside the WhatsApp summary. */
function industrySummary(slug: string, locale: Locale): string {
  const industry = getIndustryBySlug(slug, locale)
  if (!industry) return ''
  const name = industry.name.charAt(0).toLowerCase() + industry.name.slice(1)
  return locale === 'ro' ? `domeniul ${name}` : `in the ${name} field`
}

export function GuideView({
  locale,
  searchParams,
}: {
  locale: Locale
  searchParams: Record<string, string | string[] | undefined>
}) {
  const copy = guideCopy[locale]
  const path = localizePath('/ce-iti-trebuie', locale)
  const industries = getAllIndustries(locale)

  const crumbs: BreadcrumbItem[] = [
    { name: ui[locale].common.home, path: localizePath('/', locale) },
    { name: ui[locale].nav.services, path: localizePath('/servicii', locale) },
    { name: copy.title, path },
  ]

  const jsonLd = graph(
    webPageNode({ path, name: copy.title, description: copy.metaDescription, type: 'WebPage', breadcrumb: true, locale }),
    breadcrumbNode(crumbs),
  )

  // Localized service data for exactly the services the mapping can recommend,
  // read through the same getter the service pages use (offer + EN labels apply).
  const mappedSlugs = [...new Set(Object.values(GUIDE_PATHS).flat())]
  const servicesById = Object.fromEntries(
    mappedSlugs.map((slug) => {
      const service = getServicePageBySlug(slug, locale)
      if (!service) throw new Error(`[guide] service "${slug}" missing from lib/services`)
      return [
        slug,
        {
          name: service.name,
          capsule: service.answerCapsule,
          priceLabel: service.priceLabel,
          href: localizePath(`/servicii/${slug}`, locale),
        },
      ]
    }),
  )
  const industriesById = Object.fromEntries(
    industries.map((industry) => [
      industry.slug,
      { name: industry.name, href: localizePath(`/solutii/${industry.slug}`, locale) },
    ]),
  )
  const industrySummaries = Object.fromEntries(
    GUIDE_INDUSTRY_SLUGS.map((slug) => [slug, industrySummary(slug, locale)]),
  )

  const resultCopy: GuideResultProps['copy'] = {
    kicker: copy.resultKicker,
    title: copy.resultTitle,
    lead: copy.resultLead,
    priceLabel: copy.priceLabel,
    industryLabel: copy.industryLabel,
    whatsappLabel: copy.whatsappLabel,
    restart: copy.restart,
    restartHref: path,
  }

  const answers = readAnswers(searchParams)
  const resolved = resolveGuide(answers)

  let serverResult: GuideResultProps | null = null
  if (resolved) {
    const services = resolved.serviceSlugs
      .map((slug) => servicesById[slug])
      .filter((service): service is NonNullable<typeof service> => Boolean(service))
    const goalOption = guideGoalQuestion[locale].options.find((option) => option.id === answers.goal)
    const followOption = goalOption
      ? guideBranches[locale][goalOption.id].options.find((option) => option.id === answers.follow)
      : undefined
    const a3 = answers.industry === GUIDE_OTHER_ID ? copy.otherSummary : answers.industry ? industrySummaries[answers.industry] ?? '' : ''
    const message = copy.whatsappTemplate
      .replace('{a1}', goalOption?.summary ?? '')
      .replace('{a2}', followOption?.summary ?? '')
      .replace('{a3}', a3)
      .replace('{services}', joinNatural(services.map((service) => service.name), copy.andSeparator))
    serverResult = {
      services,
      industry: resolved.industrySlug ? (industriesById[resolved.industrySlug] ?? null) : null,
      whatsappHref: whatsappUrl(message),
      copy: resultCopy,
    }
  }

  const goalOptions: GuideFlowOption[] = guideGoalQuestion[locale].options.map(({ id, label }) => ({ id, label }))
  const branches = Object.fromEntries(
    Object.entries(guideBranches[locale]).map(([goalId, branch]) => [
      goalId,
      { id: branch.id, prompt: branch.prompt, options: branch.options.map(({ id, label }) => ({ id, label })) },
    ]),
  )
  const industryOptions: GuideFlowOption[] = [
    ...industries.map((industry) => ({ id: industry.slug, label: industry.name })),
    { id: GUIDE_OTHER_ID, label: copy.otherOption },
  ]

  return (
    <>
      <SiteHeader current="servicii" tone="dark" overlay />
      <main className="min-h-screen bg-[var(--shell)] text-[var(--ink)]">
        <PageOpen crumbs={crumbs} title={copy.title} word={PAGE_WORDS['/ce-iti-trebuie'][locale]} lead={copy.lead} short>
          <p className="max-w-sm leading-relaxed text-[var(--fg-2)]">{copy.intro}</p>
        </PageOpen>

        <section aria-label={copy.title} className="tone-dark pb-[clamp(5rem,10vw,9rem)]">
          <div className="studio-container">
            {serverResult ? (
              <GuideResult {...serverResult} />
            ) : (
              <>
                {/* No-JS fallback: all questions on one page, result rendered server-side from the query params. */}
                <form id="guide-form" method="get" action={path} className="flex flex-col gap-12">
                  <p className="mono-label text-[var(--fg-3)]">{copy.formLegend}</p>
                  <GuideRadioGroup
                    prompt={guideGoalQuestion[locale].prompt}
                    name="q1"
                    options={goalOptions}
                    defaultCheckedId={answers.goal}
                  />
                  {Object.entries(guideBranches[locale]).map(([goalId, branch]) => (
                    <GuideRadioGroup
                      key={goalId}
                      prompt={branch.prompt}
                      name={`q2-${branch.id}`}
                      options={branch.options.map(({ id, label }) => ({ id, label }))}
                      defaultCheckedId={goalId === answers.goal ? answers.follow : undefined}
                    />
                  ))}
                  <GuideRadioGroup
                    prompt={copy.industryPrompt}
                    name="q3"
                    options={industryOptions}
                    defaultCheckedId={answers.industry}
                  />
                  <button
                    type="submit"
                    className="self-start bg-[var(--ink)] px-6 py-3.5 font-sans text-sm font-bold text-[var(--shell)] transition-colors hover:bg-[#2E2822]"
                    style={{ borderRadius: 'var(--radius-pill)' }}
                  >
                    {copy.formSubmit} <span aria-hidden="true">→</span>
                  </button>
                </form>
                <GuideFlow
                  copy={{
                    progressTemplate: copy.progressTemplate,
                    back: copy.back,
                    next: copy.next,
                    whatsappTemplate: copy.whatsappTemplate,
                    industryPrompt: copy.industryPrompt,
                    andSeparator: copy.andSeparator,
                    resultAnnouncement: copy.resultAnnouncement,
                    otherSummary: copy.otherSummary,
                  }}
                  goalQuestion={{ id: guideGoalQuestion[locale].id, prompt: guideGoalQuestion[locale].prompt, options: goalOptions }}
                  branches={branches}
                  industryOptions={industryOptions}
                  paths={GUIDE_PATHS}
                  servicesById={servicesById}
                  industriesById={industriesById}
                  summaries={{
                    goal: Object.fromEntries(guideGoalQuestion[locale].options.map((option) => [option.id, option.summary])),
                    follow: Object.fromEntries(
                      Object.values(guideBranches[locale]).flatMap((branch) =>
                        branch.options.map((option) => [option.id, option.summary]),
                      ),
                    ),
                    industry: industrySummaries,
                  }}
                  otherId={GUIDE_OTHER_ID}
                  resultCopy={resultCopy}
                  restartHref={path}
                  formId="guide-form"
                />
              </>
            )}
          </div>
        </section>
        <Footer />
      </main>
      <JsonLd data={jsonLd} />
    </>
  )
}
