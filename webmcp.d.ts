// WebMCP declarative annotations: `toolname` + `tooldescription` on <form>,
// `toolparamdescription` on form controls. They are plain lowercase attributes
// that React passes through to the DOM; this makes them known to TypeScript.
// The import makes this file a module, so `declare module` augments the real
// React types instead of shadowing them.
import type {} from 'react'

declare module 'react' {
  interface HTMLAttributes<T> {
    toolname?: string
    tooldescription?: string
    toolparamdescription?: string
  }
}
