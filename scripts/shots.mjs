// Capturas de verificación responsive (dev). Requiere `npm run dev` corriendo.
// Uso: node scripts/shots.mjs [carpeta-salida] [reduce]
// Genera una hoja de contacto por viewport con cada escena en varios puntos del scroll.
import { chromium } from 'playwright-core'
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const OUT = process.argv[2] || 'shots'
const REDUCE = process.argv[3] === 'reduce'
const URL = 'http://localhost:5173/'

const viewports = [
  { name: 'movil-360', width: 360, height: 740, mobile: true },
  { name: 'movil-horizontal', width: 800, height: 380, mobile: true },
  { name: 'tablet-768', width: 768, height: 1024, mobile: true },
  { name: 'laptop-1024', width: 1024, height: 700 },
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'wide-1920', width: 1920, height: 1080 },
]

const stops = [
  ['.hero', 0], ['.hero', 0.6], ['.marquee', -1],
  ['.mano', 0.2], ['.mano', 0.75],
  ['.gal', 0.05], ['.gal', 0.4], ['.gal', 1],
  ['.chica', 0.15], ['.chica', 0.8],
  ['.cierre', -2],
]

await mkdir(OUT, { recursive: true })
const browser = await chromium.launch({ channel: 'msedge' })

for (const vp of viewports) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    isMobile: !!vp.mobile,
    hasTouch: !!vp.mobile,
    reducedMotion: REDUCE ? 'reduce' : 'no-preference',
  })
  const page = await ctx.newPage()
  page.on('pageerror', (e) => console.log(`  [${vp.name}] error: ${e.message}`))
  await page.goto(URL, { waitUntil: 'networkidle' })
  await page.waitForTimeout(3500) // loader + entrada del hero

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  const tiles = []
  for (const [sel, f] of stops) {
    await page.evaluate(
      async ([sel, f]) => {
        const s = document.querySelector(sel)
        const top = s.getBoundingClientRect().top + window.scrollY
        let y
        if (f === -1) y = top - window.innerHeight * 0.55 // banda centrada
        else if (f === -2) y = document.documentElement.scrollHeight // final
        else y = top + Math.max(0, s.offsetHeight - window.innerHeight) * f
        if (window.__lenis) window.__lenis.scrollTo(y, { immediate: true, force: true })
        else window.scrollTo(0, y)
        await new Promise((r) => setTimeout(r, 1400)) // deja asentar el scrub
      },
      [sel, f],
    )
    tiles.push(await page.screenshot())
  }
  await ctx.close()

  // Hoja de contacto
  const cols = vp.width > vp.height ? 4 : 6
  const tw = vp.width > vp.height ? 480 : 240
  const th = Math.round((tw * vp.height) / vp.width)
  const resized = await Promise.all(tiles.map((t) => sharp(t).resize(tw, th).png().toBuffer()))
  const rows = Math.ceil(resized.length / cols)
  const gap = 8
  const file = path.join(OUT, `${vp.name}${REDUCE ? '-reduce' : ''}.png`)
  await sharp({
    create: { width: cols * (tw + gap) + gap, height: rows * (th + gap) + gap, channels: 3, background: '#222' },
  })
    .composite(resized.map((input, i) => ({ input, left: gap + (i % cols) * (tw + gap), top: gap + Math.floor(i / cols) * (th + gap) })))
    .png()
    .toFile(file)
  console.log(`${file}  overflow-x: ${overflow}px`)
}

await browser.close()
