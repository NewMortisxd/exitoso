import { useRef } from 'react'
import { gsap, useScene, scrubTimeline, fromToLate, vh } from '../lib/motion'
import { img } from '../assets/img'
import { content } from '../content'
import { RevealText } from '../components/RevealText'
import './Galeria.css'

/** Momento "Apple": una foto pequeña crece hasta llenar la pantalla con el scroll. */
export function Galeria() {
  const ref = useRef(null)

  useScene(ref, ({ mobile }, root) => {
    const q = gsap.utils.selector(root)
    const start = mobile ? 'inset(24% 12% 24% 12% round 24px)' : 'inset(20% 34% 20% 34% round 32px)'
    const tl = scrubTimeline(root)
    tl.fromTo(q('.gal__main'), { clipPath: start }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 0.6, ease: 'power1.inOut' }, 0)
      .fromTo(q('.gal__main img'), { scale: 1.35 }, { scale: 1, duration: 0.6, ease: 'power1.inOut' }, 0)
      .fromTo(q('.gal__card--a'), { y: vh(30) }, { y: vh(-90), rotate: -18, duration: 0.6 }, 0)
      .fromTo(q('.gal__card--b'), { y: vh(50) }, { y: vh(-70), rotate: 16, duration: 0.6 }, 0)
    fromToLate(tl, q('.gal__kicker'), { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.15 }, 0.1)
    fromToLate(tl, q('.gal__shade'), { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.55)
    fromToLate(tl, q('.gal__title .reveal__word'), { yPercent: 115 }, { yPercent: 0, stagger: 0.04, duration: 0.2, ease: 'power2.out' }, 0.62)
    tl.to({}, { duration: 0.1 }) // pausa final con la foto a pantalla completa
  })

  return (
    <section className="scene gal" ref={ref} style={{ '--h': '320vh', '--h-svh': '320svh' }} aria-label={content.galeria.kicker}>
      <div className="stage gal__stage">
        <div className="gal__main">
          <img
            src={img.flores.src}
            srcSet={img.flores.srcSet}
            sizes="100vw"
            width={img.flores.width}
            height={img.flores.height}
            alt="Bubble tea con azúcar morena sostenido entre flores de cerezo"
            loading="lazy"
            decoding="async"
          />
          <div className="gal__shade" />
        </div>

        <figure className="gal__card gal__card--a">
          <img
            src={img.mesa.src}
            srcSet={img.mesa.srcSet}
            sizes="(max-width: 767px) 40vw, 20vw"
            width={img.mesa.width}
            height={img.mesa.height}
            alt="Dos bubble teas de té con leche sobre posavasos de mimbre"
            loading="lazy"
            decoding="async"
          />
        </figure>
        <figure className="gal__card gal__card--b">
          <img
            src={img.cielo.src}
            srcSet={img.cielo.srcSet}
            sizes="(max-width: 767px) 40vw, 20vw"
            width={img.cielo.width}
            height={img.cielo.height}
            alt=""
            loading="lazy"
            decoding="async"
          />
        </figure>

        <p className="gal__kicker kicker">{content.galeria.kicker}</p>
        <RevealText as="h2" lines={content.galeria.title} className="gal__title display" />
      </div>
    </section>
  )
}
