// Convierte las imágenes de "stock images/" a WebP optimizado en src/assets/img
// y genera src/assets/img/index.js con src, srcset y dimensiones.
// Uso: npm run images
import sharp from 'sharp'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const SRC = 'stock images'
const OUT = 'src/assets/img'

// PNG recortados: se mantienen a su tamaño original (no se agrandan).
const cutouts = {
  trio: 'delicious-bubble-tea-drinks-arrangement-removebg-preview.png',
  mano: 'pexels-rdne-6412836-removebg-preview.png',
  chica: 'pexels-rdne-6412837-removebg-preview.png',
}

// Fotos de alta resolución: varios anchos para srcset.
const photos = {
  flores: 'malcolm-brostrom-OFPGkd2swUM-unsplash.jpg',
  cielo: 'pexels-rdne-6412828.jpg',
  mesa: 'arrangement-with-delicious-traditional-thai-tea.jpg',
}
const WIDTHS = [800, 1400, 2200]

await mkdir(OUT, { recursive: true })
const imports = []
const entries = []

for (const [name, file] of Object.entries(cutouts)) {
  const input = sharp(path.join(SRC, file)).trim() // quita bordes transparentes sobrantes
  const out = `${name}.webp`
  const info = await input.webp({ quality: 92, alphaQuality: 100, effort: 6 }).toFile(path.join(OUT, out))
  imports.push(`import ${name} from './${out}'`)
  entries.push(`  ${name}: { src: ${name}, width: ${info.width}, height: ${info.height} },`)
  console.log(`✓ ${out} ${info.width}×${info.height} ${(info.size / 1024).toFixed(0)}KB`)
}

for (const [name, file] of Object.entries(photos)) {
  const meta = await sharp(path.join(SRC, file)).metadata()
  const ratio = meta.height / meta.width
  const set = []
  for (const w of WIDTHS) {
    const out = `${name}-${w}.webp`
    const info = await sharp(path.join(SRC, file)).rotate().resize({ width: w }).webp({ quality: 78, effort: 6 }).toFile(path.join(OUT, out))
    const id = `${name}${w}`
    imports.push(`import ${id} from './${out}'`)
    set.push(`\${${id}} ${w}w`)
    console.log(`✓ ${out} ${(info.size / 1024).toFixed(0)}KB`)
  }
  const mid = WIDTHS[1]
  entries.push(`  ${name}: { src: ${name}${mid}, srcSet: \`${set.join(', ')}\`, width: ${mid}, height: ${Math.round(mid * ratio)} },`)
}

await writeFile(
  path.join(OUT, 'index.js'),
  `// Generado por scripts/optimize-images.mjs — no editar a mano.\n${imports.join('\n')}\n\nexport const img = {\n${entries.join('\n')}\n}\n`,
)
console.log('✓ index.js')
