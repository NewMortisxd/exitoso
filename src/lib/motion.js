import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
// La barra del navegador móvil no debe recalcular (y hacer saltar) las escenas.
ScrollTrigger.config({ ignoreMobileResize: true })

export { gsap, ScrollTrigger }

export const MQ = {
  // Escenas animadas: siempre, salvo pantallas muy bajas (móvil horizontal), donde no caben fijas.
  motion: '(min-height: 501px)',
  // "Reducir movimiento" del sistema: se mantienen las animaciones atadas al scroll,
  // pero se quitan el scroll suave (Lenis) y el parallax con el mouse.
  reduce: '(prefers-reduced-motion: reduce)',
  mobile: '(max-width: 767px)',
  desktop: '(min-width: 1024px) and (pointer: fine)',
}

export const motionEnabled = () => window.matchMedia(MQ.motion).matches
export const reducedMotion = () => window.matchMedia(MQ.reduce).matches

/** Mantiene html.is-static sincronizado: el CSS la usa para mostrar las escenas sin pin. */
export function syncStaticClass() {
  const mq = window.matchMedia(MQ.motion)
  const apply = () => document.documentElement.classList.toggle('is-static', !mq.matches)
  apply()
  mq.addEventListener('change', apply)
}

// Unidades relativas al viewport, recalculadas en cada refresh de ScrollTrigger.
export const vh = (n) => () => (window.innerHeight * n) / 100
export const vw = (n) => () => (window.innerWidth * n) / 100

/**
 * Registra las animaciones de una escena. `build(conditions, root)` solo corre
 * cuando el movimiento está permitido; todo lo que crea se revierte solo.
 */
export function useScene(ref, build, deps = []) {
  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    mm.add(MQ, (ctx) => {
      if (!ctx.conditions.motion) return
      return build(ctx.conditions, ref.current)
    }, ref)
    return () => mm.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

/** Timeline con scrub atada al recorrido completo de una escena sticky. */
export function scrubTimeline(trigger, opts = {}) {
  return gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.8,
      invalidateOnRefresh: true,
      ...opts,
    },
  })
}

/**
 * fromTo que empieza después del inicio de la timeline. Fija antes el estado
 * inicial con gsap.set: tras un ScrollTrigger.refresh() la timeline se revierte
 * y esos tweens no se vuelven a pintar hasta que el scroll llega a ellos; así el
 * elemento queda oculto/en su pose inicial en lugar de visible antes de tiempo.
 */
export function fromToLate(tl, targets, from, to, position) {
  gsap.set(targets, from)
  return tl.fromTo(targets, from, to, position)
}

/** Desplaza los elementos [data-mouse="factor"] según la posición del cursor. */
export function mouseParallax(root) {
  if (reducedMotion()) return

  const items = gsap.utils.toArray('[data-mouse]', root).map((el) => ({
    f: parseFloat(el.dataset.mouse),
    x: gsap.quickTo(el, 'x', { duration: 1, ease: 'power3' }),
    y: gsap.quickTo(el, 'y', { duration: 1, ease: 'power3' }),
  }))
  const onMove = (e) => {
    const nx = e.clientX / window.innerWidth - 0.5
    const ny = e.clientY / window.innerHeight - 0.5
    for (const it of items) {
      it.x(nx * it.f * window.innerWidth)
      it.y(ny * it.f * window.innerHeight)
    }
  }
  window.addEventListener('pointermove', onMove)
  return () => window.removeEventListener('pointermove', onMove)
}

/** Parallax de perlas por profundidad dentro de una timeline. */
export function perlasParallax(tl, root, strength = 30) {
  for (const depth of [1, 2, 3]) {
    const els = root.querySelectorAll(`.perla[data-depth="${depth}"]`)
    if (els.length) tl.to(els, { y: vh(-strength * depth), rotate: 40 * depth, duration: 1 }, 0)
  }
}
