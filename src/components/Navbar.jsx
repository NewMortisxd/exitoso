import { useEffect, useRef } from 'react'
import { ScrollTrigger } from '../lib/motion'
import { getLenis } from '../hooks/useLenis'
import { content } from '../content'
import { LogoCompleto } from './Brand'
import './Navbar.css'

/**
 * Navbar fija con el logo principal. Transparente sobre el hero; al hacer
 * scroll se vuelve una píldora translúcida. Se esconde al bajar y vuelve al subir.
 */
export function Navbar() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const y = self.scroll()
        el.classList.toggle('is-scrolled', y > 60)
        el.classList.toggle('is-hidden', self.direction > 0 && y > window.innerHeight * 0.6)
      },
    })
    return () => st.kill()
  }, [])

  const toTop = (e) => {
    e.preventDefault()
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(0, { duration: 1.6 })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <header className="nav" ref={ref}>
      <a href="#inicio" className="nav__pill nav__brand" onClick={toTop} aria-label="el exitoso — ir al inicio">
        <LogoCompleto />
      </a>
      <p className="nav__pill nav__tag kicker">
        <span className="nav__dot" aria-hidden="true" />
        {content.navTag}
      </p>
    </header>
  )
}
