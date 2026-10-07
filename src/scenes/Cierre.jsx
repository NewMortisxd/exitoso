import { useRef } from 'react'
import { gsap, useScene, fromToLate, vw, vh } from '../lib/motion'
import { img } from '../assets/img'
import { content } from '../content'
import { LogoCompleto } from '../components/Brand'
import { RevealText } from '../components/RevealText'
import './Cierre.css'

/** Las tres fotos se reúnen alrededor del logo mientras la sección entra. */
export function Cierre() {
  const ref = useRef(null)

  useScene(ref, (_, root) => {
    const q = gsap.utils.selector(root)
    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      scrollTrigger: { trigger: root, start: 'top 85%', end: 'top 5%', scrub: 0.8, invalidateOnRefresh: true },
    })
    // El ángulo final va aquí (no en CSS): GSAP absorbe la propiedad `rotate` de CSS.
    const home = (rotate) => ({ x: 0, y: 0, rotate, duration: 1 })
    fromToLate(tl, q('.cierre__pic--trio'), { x: vw(-40), y: vh(20), rotate: -60 }, home(-10), 0)
    fromToLate(tl, q('.cierre__pic--mano'), { x: vw(40), y: vh(-10), rotate: 64 }, home(14), 0.05)
    fromToLate(tl, q('.cierre__pic--chica'), { x: vw(35), y: vh(30), rotate: 35 }, home(5), 0.1)
    fromToLate(tl, q('.cierre__logo .logo-full__icono'), { scale: 0, rotate: -90, transformOrigin: '50% 100%' }, { scale: 1, rotate: 0, duration: 0.6, ease: 'back.out(2)' }, 0.3)
    fromToLate(tl, q('.cierre__logo .logo-full__texto'), { xPercent: -12, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, duration: 0.6 }, 0.38)
    fromToLate(tl, q('.cierre__slogan .reveal__word'), { yPercent: 115 }, { yPercent: 0, stagger: 0.05, duration: 0.4 }, 0.5)
    fromToLate(tl, q('.cierre__tagline'), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.3 }, 0.7)
  })

  return (
    <section className="cierre" ref={ref} aria-label="Pide el éxito">
      <img className="cutout cierre__pic cierre__pic--trio" src={img.trio.src} width={img.trio.width} height={img.trio.height} alt="" loading="lazy" decoding="async" />
      <img className="cutout cierre__pic cierre__pic--mano" src={img.mano.src} width={img.mano.width} height={img.mano.height} alt="" loading="lazy" decoding="async" />
      <img className="cutout cierre__pic cierre__pic--chica" src={img.chica.src} width={img.chica.width} height={img.chica.height} alt="" loading="lazy" decoding="async" />

      <div className="cierre__center">
        <LogoCompleto className="cierre__logo" />
        <RevealText as="h2" lines={content.slogan} className="cierre__slogan display" />
        <p className="cierre__tagline">{content.cierre.tagline}</p>
      </div>

      <footer className="cierre__footer kicker">
        <span>{content.cierre.footer}</span>
        <span>© {new Date().getFullYear()}</span>
      </footer>
    </section>
  )
}
