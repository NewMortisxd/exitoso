import { useRef } from 'react'
import { useScene, ScrollTrigger } from '../lib/motion'
import './Marquee.css'

/** Franja de texto en bucle infinito. Cambia de dirección según el scroll. */
export function Marquee({ items, className = '' }) {
  const ref = useRef(null)

  useScene(ref, (_, root) => {
    const st = ScrollTrigger.create({
      trigger: root,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => root.classList.toggle('is-reverse', self.direction < 0),
    })
    return () => st.kill()
  })

  // Dos copias idénticas: la animación mueve -50% y vuelve sin corte.
  const row = (hidden) => (
    <div className="marquee__row" aria-hidden={hidden || undefined}>
      {items.map((t, i) => (
        <span key={i} className="marquee__item">
          {t}
          <span className="marquee__dot" />
        </span>
      ))}
    </div>
  )

  return (
    <div className={`marquee ${className}`} ref={ref}>
      <div className="marquee__track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  )
}
