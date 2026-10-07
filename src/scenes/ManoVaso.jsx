import { useRef } from 'react'
import { gsap, useScene, scrubTimeline, fromToLate, mouseParallax, perlasParallax, vh } from '../lib/motion'
import { img } from '../assets/img'
import { content } from '../content'
import { Perlas } from '../components/Perlas'
import './ManoVaso.css'

export function ManoVaso() {
  const ref = useRef(null)

  useScene(ref, ({ desktop, mobile }, root) => {
    const q = gsap.utils.selector(root)
    const tl = scrubTimeline(root)
    // Tipografía cinética: las dos líneas se cruzan
    tl.fromTo(q('.mano__line--a'), { xPercent: 18 }, { xPercent: -22, duration: 1 }, 0)
      .fromTo(q('.mano__line--b'), { xPercent: -18 }, { xPercent: 22, duration: 1 }, 0)
      // La mano entra desde abajo girando
      .fromTo(
        q('.mano__hand'),
        { y: vh(mobile ? 60 : 80), rotate: -28, scale: 0.8 },
        { y: 0, rotate: -12, scale: 1, duration: 0.5, ease: 'power2.out' },
        0,
      )
      .to(q('.mano__hand'), { y: vh(-6), rotate: -5, duration: 0.5 }, 0.5)
    fromToLate(tl, q('.mano__caption'), { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.2 }, 0.45)
    perlasParallax(tl, root, 34)
    if (desktop) return mouseParallax(root)
  })

  return (
    <section className="scene mano" ref={ref} style={{ '--h': '250vh', '--h-svh': '250svh' }} aria-label="Cada sorbo">
      <div className="stage mano__stage">
        <h2 className="mano__title display" aria-label={content.mano.lines.join(' ')}>
          <span className="mano__line mano__line--a" aria-hidden="true">
            {content.mano.lines[0]}
          </span>
          <span className="mano__line mano__line--b" aria-hidden="true">
            {content.mano.lines[1]}
          </span>
        </h2>

        <div className="layer" data-mouse="0.03">
          <Perlas count={14} seed={23} colors={['var(--negro)', 'var(--naranja)']} />
        </div>

        <div className="layer" data-mouse="0.02">
          <div className="mano__hand">
            <img
              className="cutout"
              src={img.mano.src}
              width={img.mano.width}
              height={img.mano.height}
              alt="Mano sosteniendo un bubble tea de té con leche con perlas de tapioca"
              loading="lazy"
              decoding="async"
              data-cursor="¡salud!"
            />
          </div>
        </div>

        <p className="mano__caption">{content.mano.caption}</p>
      </div>
    </section>
  )
}
