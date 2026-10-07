import { useRef } from 'react'
import { gsap, useScene, scrubTimeline, mouseParallax, perlasParallax, vh, vw } from '../lib/motion'
import { img } from '../assets/img'
import { content } from '../content'
import { LogoCompleto } from '../components/Brand'
import { RevealText } from '../components/RevealText'
import { Perlas } from '../components/Perlas'
import { Sello } from '../components/Sello'
import './Hero.css'

/*
 * Estructura de capas (para que no choquen las transformaciones):
 *   [data-mouse]  → parallax con el mouse
 *     .js-scrub   → animación atada al scroll
 *       .js-intro → entrada después del loader
 */
export function Hero({ ready }) {
  const ref = useRef(null)

  // Scroll
  useScene(ref, ({ desktop }, root) => {
    const q = gsap.utils.selector(root)
    const tl = scrubTimeline(root)
    tl.to(q('.hero__word'), { y: vh(-14), scale: 1.08, duration: 1 }, 0)
      .to(q('.hero__arch'), { rotate: 3, scale: 1.12, y: vh(-6), duration: 1 }, 0)
      .fromTo(q('.hero__arch img'), { scale: 1.25 }, { scale: 1, duration: 1 }, 0)
      .to(q('.hero__trio'), { y: vh(-42), x: vw(-6), rotate: -16, duration: 1 }, 0)
      .to(q('.hero__slogan'), { y: vh(-10), duration: 1 }, 0)
      .to(q('.hero__sello'), { rotate: 260, y: vh(-8), duration: 1 }, 0)
    perlasParallax(tl, root, 26)
    if (desktop) return mouseParallax(root)
  })

  // Entrada (cuando el loader termina)
  useScene(
    ref,
    (_, root) => {
      if (!ready) {
        gsap.set(root.querySelectorAll('.js-intro'), { autoAlpha: 0 })
        return
      }
      const q = gsap.utils.selector(root)
      gsap
        .timeline({ defaults: { ease: 'expo.out', duration: 1.4 } })
        .fromTo(q('.hero__word .js-intro'), { autoAlpha: 0, yPercent: 30, scale: 0.92 }, { autoAlpha: 1, yPercent: 0, scale: 1 }, 0)
        .fromTo(q('.hero__arch .js-intro'), { autoAlpha: 0, y: vh(40), rotate: -14 }, { autoAlpha: 1, y: 0, rotate: 0 }, 0.1)
        .fromTo(q('.hero__trio .js-intro'), { autoAlpha: 0, y: vh(50), rotate: 30, scale: 0.6 }, { autoAlpha: 1, y: 0, rotate: 0, scale: 1, ease: 'back.out(1.4)' }, 0.3)
        .fromTo(q('.hero__slogan.js-intro'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, 0.45)
        .fromTo(q('.hero__slogan .reveal__word'), { yPercent: 115 }, { yPercent: 0, stagger: 0.08, duration: 1.1 }, 0.45)
        .fromTo(q('.hero__sello .js-intro'), { autoAlpha: 0, scale: 0.6, rotate: -60 }, { autoAlpha: 1, scale: 1, rotate: 0, duration: 1.2, ease: 'back.out(1.6)' }, 0.7)
        .fromTo(q('.perla'), { scale: 0 }, { scale: 1, stagger: 0.03, duration: 0.9, ease: 'back.out(2)' }, 0.5)
    },
    [ready],
  )

  return (
    <section id="inicio" className="scene hero" ref={ref} style={{ '--h': '300vh', '--h-svh': '300svh' }} aria-label="Inicio">
      <div className="stage hero__stage">
        <h1 className="sr-only">el exitoso — bubble tea. {content.slogan}</h1>

        <div className="layer" data-mouse="-0.012">
          <div className="hero__word js-scrub">
            <LogoCompleto className="js-intro" />
          </div>
        </div>

        <div className="layer" data-mouse="0.02">
          <Perlas count={16} seed={11} colors={['var(--negro)', 'var(--crema)', 'var(--negro)']} />
        </div>

        <div className="layer" data-mouse="0.018">
          <div className="hero__arch js-scrub">
            <div className="hero__arch-in js-intro">
              <img
                src={img.cielo.src}
                srcSet={img.cielo.srcSet}
                sizes="(max-width: 767px) 62vw, 32vw"
                width={img.cielo.width}
                height={img.cielo.height}
                alt="Vaso de bubble tea de té con leche y tapioca en alto contra el cielo"
                fetchPriority="high"
              />
            </div>
          </div>
        </div>

        <div className="layer" data-mouse="0.045">
          <div className="hero__trio js-scrub">
            <img
              className="cutout js-intro"
              src={img.trio.src}
              width={img.trio.width}
              height={img.trio.height}
              alt="Tres bubble teas con tapas de domo y pajillas de colores"
              data-cursor="¡3x!"
            />
          </div>
        </div>

        <div className="hero__sello js-scrub">
          <div className="js-intro">
            <Sello
              text={content.sello}
              center={
                <span className="hero__sello-arrow" aria-hidden="true">
                  ↓
                </span>
              }
            />
          </div>
        </div>

        <div className="hero__slogan js-scrub js-intro">
          <RevealText lines={content.slogan} className="display" />
        </div>
      </div>
    </section>
  )
}
