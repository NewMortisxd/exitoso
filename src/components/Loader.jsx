import { useLayoutEffect, useRef } from 'react'
import { gsap, ScrollTrigger, motionEnabled } from '../lib/motion'
import { getLenis } from '../hooks/useLenis'
import { LogoCompleto } from './Brand'
import './Loader.css'

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

/**
 * Pantalla de carga: el logo aparece y su punto naranja crece hasta cubrir
 * la pantalla, que se desvanece sobre el hero (también naranja).
 * onReveal: arranca la entrada del hero. onFinish: desmontar el loader.
 */
export function Loader({ onReveal, onFinish }) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const root = ref.current
    const html = document.documentElement
    html.classList.add('is-loading')
    window.scrollTo(0, 0)

    const finish = () => {
      html.classList.remove('is-loading')
      getLenis()?.start()
      ScrollTrigger.refresh()
      onFinish()
    }

    if (!motionEnabled()) {
      onReveal()
      finish()
      return
    }

    let killed = false
    const ctx = gsap.context(() => {
      gsap.from('.loader__logo .logo-full__icono', { yPercent: 60, rotate: -20, opacity: 0, duration: 0.9, ease: 'back.out(1.8)' })
      gsap.from('.loader__logo .logo-full__texto', { xPercent: -8, opacity: 0, duration: 0.8, delay: 0.15, ease: 'power3.out' })
      gsap.from('.loader__dot', { scale: 0, duration: 0.6, delay: 0.35, ease: 'back.out(3)' })
    }, root)

    // Espera fuentes (máx. 2.5s) y un mínimo para que se vea la marca.
    Promise.race([Promise.all([document.fonts.ready, wait(1100)]), wait(2500)]).then(() => {
      if (killed) return
      ctx.add(() => {
        const dot = root.querySelector('.loader__dot')
        const cover = (Math.hypot(window.innerWidth, window.innerHeight) / dot.offsetWidth) * 1.1
        gsap
          .timeline({ onComplete: finish })
          .to('.loader__logo', { yPercent: -30, opacity: 0, duration: 0.45, ease: 'power2.in' })
          .to(dot, { scale: cover, duration: 0.9, ease: 'expo.inOut' }, '<0.1')
          .add(onReveal, '-=0.15')
          .to(root, { opacity: 0, duration: 0.5, ease: 'power1.out' }, '-=0.1')
      })
    })

    return () => {
      killed = true
      ctx.revert()
      html.classList.remove('is-loading')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="loader" ref={ref} aria-hidden="true">
      <div className="loader__inner">
        <LogoCompleto className="loader__logo" />
        <span className="loader__dot" />
      </div>
    </div>
  )
}
