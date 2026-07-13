import { ImageResponse } from 'next/og'

export const alt = 'MAST Studio — produse digitale construite cu direcție'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#050A14', color: '#F5F1E8', padding: '72px 80px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#C9A86A', fontSize: 28, letterSpacing: '0.18em' }}>
        <span>MAST STUDIO</span><span>TM · RO</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ fontSize: 78, fontWeight: 700, lineHeight: 1.04, maxWidth: 980 }}>Produse digitale construite cu direcție.</div>
        <div style={{ fontSize: 28, color: '#B8B5AD' }}>Web design · eCommerce · aplicații · automatizări</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, color: '#C9A86A', fontSize: 22 }}>
        <span style={{ width: 72, height: 2, background: '#C9A86A' }} /> maststudio.ro
      </div>
    </div>,
    size,
  )
}
