// Generado por scripts/optimize-images.mjs — no editar a mano.
import trio from './trio.webp'
import mano from './mano.webp'
import chica from './chica.webp'
import flores800 from './flores-800.webp'
import flores1400 from './flores-1400.webp'
import flores2200 from './flores-2200.webp'
import cielo800 from './cielo-800.webp'
import cielo1400 from './cielo-1400.webp'
import cielo2200 from './cielo-2200.webp'
import mesa800 from './mesa-800.webp'
import mesa1400 from './mesa-1400.webp'
import mesa2200 from './mesa-2200.webp'

export const img = {
  trio: { src: trio, width: 311, height: 335 },
  mano: { src: mano, width: 309, height: 489 },
  chica: { src: chica, width: 394, height: 612 },
  flores: { src: flores1400, srcSet: `${flores800} 800w, ${flores1400} 1400w, ${flores2200} 2200w`, width: 1400, height: 2100 },
  cielo: { src: cielo1400, srcSet: `${cielo800} 800w, ${cielo1400} 1400w, ${cielo2200} 2200w`, width: 1400, height: 2100 },
  mesa: { src: mesa1400, srcSet: `${mesa800} 800w, ${mesa1400} 1400w, ${mesa2200} 2200w`, width: 1400, height: 2100 },
}
