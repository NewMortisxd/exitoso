import { useState } from 'react'
import { useLenis } from './hooks/useLenis'
import { content } from './content'
import { Loader } from './components/Loader'
import { Cursor } from './components/Cursor'
import { Navbar } from './components/Navbar'
import { Marquee } from './components/Marquee'
import { Hero } from './scenes/Hero'
import { ManoVaso } from './scenes/ManoVaso'
import { Galeria } from './scenes/Galeria'
import { Chica } from './scenes/Chica'
import { Cierre } from './scenes/Cierre'
import { Publico } from './scenes/Publico'

export default function App() {
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(true)
  useLenis()

  return (
    <>
      {loading && <Loader onReveal={() => setReady(true)} onFinish={() => setLoading(false)} />}
      <Navbar />
      <main>
        <Hero ready={ready} />
        <Marquee items={content.marquee} className="marquee--hero" />
        <ManoVaso />
        <Galeria />
        <Chica />
        <Cierre />
        <Publico />
      </main>
      <Cursor />
      <div className="grain" aria-hidden="true" />
    </>
  )
}
