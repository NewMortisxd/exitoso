import { useEffect, useRef, useState } from 'react'
import { gsap, useScene, fromToLate, vh } from '../lib/motion'
import { content } from '../content'
import { RevealText } from '../components/RevealText'
import { Perlas } from '../components/Perlas'
import video from '../assets/vid/publico.mp4'
import poster from '../assets/vid/publico-poster.webp'
import './Publico.css'

/** Final en broma: el video del curso presentado como "nuestro público objetivo". */
export function Publico() {
  const ref = useRef(null)
  const videoRef = useRef(null)
  const [muted, setMuted] = useState(true)
  const t = content.publico

  // Se reproduce solo cuando está a la vista (y se pausa al salir).
  useEffect(() => {
    const v = videoRef.current
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {})
        else v.pause()
      },
      { threshold: 0.4 },
    )
    io.observe(v)
    return () => io.disconnect()
  }, [])

  const toggleSound = () => {
    const v = videoRef.current
    v.muted = !v.muted
    setMuted(v.muted)
    if (!v.muted) v.play().catch(() => {})
  }

  useScene(ref, (_, root) => {
    const q = gsap.utils.selector(root)
    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      scrollTrigger: { trigger: root, start: 'top 85%', end: 'top 5%', scrub: 0.8, invalidateOnRefresh: true },
    })
    fromToLate(tl, q('.publico__phone'), { y: vh(35), rotate: 18 }, { y: 0, rotate: -5, duration: 1 }, 0)
    fromToLate(tl, q('.publico__title .reveal__word'), { yPercent: 115 }, { yPercent: 0, stagger: 0.08, duration: 0.5 }, 0.1)
    fromToLate(tl, q('.publico__dato'), { x: -40, autoAlpha: 0 }, { x: 0, autoAlpha: 1, stagger: 0.08, duration: 0.4 }, 0.35)
    fromToLate(tl, q('.publico__sticker'), { scale: 0, rotate: -80 }, { scale: 1, rotate: 12, duration: 0.5, ease: 'back.out(2.2)' }, 0.7)
    fromToLate(tl, q('.publico__arrow'), { autoAlpha: 0, x: -30 }, { autoAlpha: 1, x: 0, duration: 0.3 }, 0.75)
  })

  return (
    <section className="publico" ref={ref} aria-label="Nuestro público objetivo">
      <Perlas count={10} seed={77} colors={['var(--naranja)', 'var(--crema)']} />

      <div className="publico__grid">
        <div className="publico__info">
          <p className="kicker publico__kicker">{t.kicker}</p>
          <RevealText as="h2" lines={t.title} className="publico__title display" />
          <dl className="publico__datos">
            {t.datos.map(([k, v]) => (
              <div className="publico__dato" key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <p className="publico__nota">{t.nota}</p>
        </div>

        <div className="publico__media">
          <svg className="publico__arrow" viewBox="0 0 120 60" aria-hidden="true">
            <path d="M4 40 C 30 6, 70 4, 104 28" />
            <path d="M92 14 L 106 29 L 88 36" />
          </svg>
          <div className="publico__phone" data-cursor="jajaja">
            <video
              ref={videoRef}
              src={video}
              poster={poster}
              muted
              loop
              playsInline
              preload="none"
              width="540"
              height="968"
              aria-label="Video del curso: dos compañeros peleando con sillas en el salón, como en una película de superhéroes"
            />
            <button type="button" className="publico__sound" onClick={toggleSound} aria-pressed={!muted}>
              <span aria-hidden="true">{muted ? '🔇' : '🔊'}</span> {muted ? t.sonido.on : t.sonido.off}
            </button>
          </div>
          <div className="publico__sticker" aria-hidden="true">
            <span>{t.sticker}</span>
            <span className="publico__check">✓</span>
          </div>
        </div>
      </div>

      <footer className="publico__footer kicker">
        <span>{content.cierre.footer}</span>
        <span>© {new Date().getFullYear()}</span>
      </footer>
    </section>
  )
}
