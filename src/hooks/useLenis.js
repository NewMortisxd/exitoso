import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, motionEnabled, reducedMotion } from '../lib/motion'

let instance = null
export const getLenis = () => instance

/** Scroll suave solo en escritorio con mouse; en touch se usa el scroll nativo. */
export function useLenis() {
  useEffect(() => {
    if (!motionEnabled() || reducedMotion() || !window.matchMedia('(pointer: fine)').matches) return

    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 })
    instance = lenis
    if (import.meta.env.DEV) window.__lenis = lenis // para scripts/shots.mjs
    if (document.documentElement.classList.contains('is-loading')) lenis.stop()

    // Lenis y ScrollTrigger en el mismo loop para que no haya desfase.
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      instance = null
    }
  }, [])
}
