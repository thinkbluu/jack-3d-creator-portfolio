import { ImageResponse } from 'next/og'

export const OG_SIZE = { width: 1200, height: 630 }

type OgImageInput = {
  kicker: string
  title: string
  subtitle?: string
}

function titleSize(title: string) {
  if (title.length > 70) return 56
  if (title.length > 48) return 64
  return 76
}

/** Branded 1200×630 social preview used by every page type. */
export function renderOgImage({ kicker, title, subtitle }: OgImageInput) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#050A14',
          color: '#F5F1E8',
          padding: '64px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#C9A86A', fontSize: 26, letterSpacing: '0.18em' }}>
          <span>MAST STUDIO</span>
          <span>{kicker.toUpperCase()}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ fontSize: titleSize(title), fontWeight: 700, lineHeight: 1.06, maxWidth: 1040 }}>{title}</div>
          {subtitle ? <div style={{ fontSize: 28, lineHeight: 1.35, color: '#B8B5AD', maxWidth: 1000 }}>{subtitle}</div> : null}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, color: '#C9A86A', fontSize: 22 }}>
          <span style={{ width: 72, height: 2, background: '#C9A86A' }} />
          <span>maststudio.ro · Web design Timișoara</span>
        </div>
      </div>
    ),
    OG_SIZE,
  )
}
