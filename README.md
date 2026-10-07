# el exitoso · bubble tea

Landing de una página con animaciones al hacer scroll, al estilo de las páginas de producto de Apple.
Hecha con Vite + React, GSAP ScrollTrigger y Lenis.

## Uso

```bash
npm install
npm run dev       # desarrollo en http://localhost:5173
npm run build     # versión final en dist/
npm run preview   # sirve dist/ localmente
```

## Contenido e imágenes

- **Textos:** todos están en `src/content.js` (eslogan, frases, marquee).
- **Imágenes:** los originales van en `stock images/`. Después de cambiarlos, ejecuta `npm run images`, que los convierte a WebP en `src/assets/img/` y regenera `src/assets/img/index.js`.
- **Logos:** los SVG están en `src/assets/svg/`. El logo principal (vaso + texto) es el componente `LogoCompleto` de `src/components/Brand.jsx`.

## Estructura

- `src/scenes/`: una escena por archivo (Hero, ManoVaso, Galeria, Chica, Cierre).
- `src/components/`: Navbar, Loader, Marquee, Sello, Perlas, RevealText, Cursor, Brand.
- `src/lib/motion.js`: configuración de GSAP, media queries y helpers de animación.
- `scripts/shots.mjs`: capturas de verificación en 6 tamaños de pantalla (usa Edge con playwright-core).
