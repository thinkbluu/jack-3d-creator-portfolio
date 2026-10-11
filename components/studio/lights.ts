'use client'

import { useCallback, useSyncExternalStore } from 'react'

const KEY = 'mast-lights'
const listeners = new Set<() => void>()

function read() {
  if (typeof document === 'undefined') return false
  return document.documentElement.dataset.lights === 'on'
}

function write(on: boolean) {
  if (on) document.documentElement.dataset.lights = 'on'
  else delete document.documentElement.dataset.lights
  try {
    window.localStorage.setItem(KEY, on ? 'on' : 'off')
  } catch {}
  listeners.forEach((listener) => listener())
}

/** Restore the visitor's choice once on the client. */
let restored = false
function restore() {
  if (restored || typeof window === 'undefined') return
  restored = true
  try {
    if (window.localStorage.getItem(KEY) === 'on') document.documentElement.dataset.lights = 'on'
  } catch {}
}

function subscribe(listener: () => void) {
  restore()
  listeners.add(listener)
  listener()
  return () => listeners.delete(listener)
}

/**
 * "Lights on": one switch, shared by the dark sections of the homepage, that
 * turns the night scenes into calm daylight for anyone who prefers to read
 * rather than explore. The choice is remembered on this device.
 */
export function useLights() {
  const on = useSyncExternalStore(subscribe, read, () => false)
  const toggle = useCallback(() => write(!read()), [])
  return { on, toggle }
}
