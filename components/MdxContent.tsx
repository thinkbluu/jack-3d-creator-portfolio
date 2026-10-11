import type { ComponentProps } from 'react'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'

const components = {
  // Images in posts: ![Alt text](/blog/slug/image.webp "Optional caption").
  // Spans, not a figure, because Markdown puts images inside paragraphs.
  img: ({ src, alt, title }: ComponentProps<'img'>) => (
    <span className="mdx-figure">
      {/* eslint-disable-next-line @next/next/no-img-element -- MDX images have no known size */}
      <img src={typeof src === 'string' ? src : undefined} alt={alt ?? ''} loading="lazy" decoding="async" />
      {title ? <span className="mdx-caption">{title}</span> : null}
    </span>
  ),
  // Wide tables scroll inside their own box on small screens, so the page
  // itself never scrolls sideways. The box is focusable for keyboard users.
  table: (props: ComponentProps<'table'>) => (
    <div className="table-scroll" role="region" aria-label="Tabel" tabIndex={0}>
      <table {...props} />
    </div>
  ),
}

/** Renders post and case-study MDX, including Markdown tables (GFM). */
export default function MdxContent({ source }: { source: string }) {
  return <MDXRemote source={source} components={components} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
}
