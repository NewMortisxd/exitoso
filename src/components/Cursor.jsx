import { useEffect, useRef, useState } from 'react'
import { gsap, motionEnabled } from '../lib/motion'
import './Cursor.css'

/** Cursor propio (solo mouse). Crece sobre elementos con data-cursor="texto". */
export function Cursor() {
  const ref = useRef(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    setEnabled(motionEnabled() && window.matchMedia('(pointer: fine)').matches)
  }, [])

  useEffect(() => {
    if (!enabled) return
    const el = ref.current
    const label = el.firstChild
    const xTo = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3' })
    document.documentElement.classList.add('has-cursor')

    const onMove = (e) => {
      xTo(e.clientX)
      yTo(e.clientY)
      el.classList.add('is-visible')
      const target = e.target.closest?.('[data-cursor]')
      el.classList.toggle('is-big', !!target)
      if (target) label.textContent = target.dataset.cursor
    }
    const onLeave = () => el.classList.remove('is-visible')
    window.addEventListener('pointermove', onMove)
    document.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      document.documentElement.classList.remove('has-cursor')
    }
  }, [enabled])

  if (!enabled) return null
  return (
    <div className="cursor-layer" aria-hidden="true">
      <div className="cursor" ref={ref}>
        <span />
      </div>
    </div>
  )
}
