import { useRef } from 'react'
import { gsap, useScene, scrubTimeline, fromToLate, mouseParallax, perlasParallax, vh, vw } from '../lib/motion'
import { img } from '../assets/img'
import { content } from '../content'
import { RevealText } from '../components/RevealText'
import { Perlas } from '../components/Perlas'
import './Chica.css'

export function Chica() {
  const ref = useRef(null)

  useScene(ref, ({ desktop, mobile }, root) => {
    const q = gsap.utils.selector(root)
    const tl = scrubTimeline(root)
    // El fondo pasa de negro (escena anterior) a naranja
    tl.fromTo(q('.chica__stage'), { backgroundColor: '#0b0b09' }, { backgroundColor: '#ff5e1d', duration: 0.3 }, 0)
    fromToLate(tl, q('.chica__blob'), { scale: 0 }, { scale: 1, duration: 0.45, ease: 'power2.out' }, 0.1)
    fromToLate(
      tl,
      q('.chica__img'),
      { x: vw(mobile ? 30 : 25), y: vh(45), rotate: 16, scale: 0.7 },
      { x: 0, y: 0, rotate: 0, scale: 1, duration: 0.5, ease: 'power2.out' },
      0.05,
    )
    fromToLate(tl, q('.chica__text .reveal__word'), { yPercent: 115 }, { yPercent: 0, stagger: 0.04, duration: 0.2, ease: 'power2.out' }, 0.3)
    tl.to(q('.chica__img'), { y: vh(-4), rotate: -3, duration: 0.35 }, 0.65)
    perlasParallax(tl, root, 30)
    if (desktop) return mouseParallax(root)
  })

  return (
    <section className="scene chica" ref={ref} style={{ '--h': '260vh', '--h-svh': '260svh' }} aria-label="El antojo">
      <div className="stage chica__stage">
        <div className="layer" data-mouse="0.012">
          <div className="chica__blob" />
        </div>

        <div className="layer" data-mouse="0.03">
          <Perlas count={10} seed={41} colors={['var(--negro)', 'var(--crema)']} />
        </div>

        <RevealText as="h2" lines={content.chica.lines} className="chica__text display" />

        <div className="layer" data-mouse="0.022">
          <div className="chica__img">
            <img
              className="cutout"
              src={img.chica.src}
              width={img.chica.width}
              height={img.chica.height}
              alt="Chica tomando bubble tea con pajilla, mirando de reojo"
              loading="lazy"
              decoding="async"
              data-cursor="mmm…"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
