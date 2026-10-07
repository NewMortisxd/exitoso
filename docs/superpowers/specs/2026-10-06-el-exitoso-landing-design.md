# el exitoso — Landing scrollytelling (diseño)

Fecha: 2026-10-06 · Estado: pendiente de revisión del usuario

## 1. Objetivo
Landing de una sola página, de impacto visual, para el negocio de bubble tea **el exitoso**. Sin menú, carrito ni backend. El valor es la marca y la sensación al hacer scroll, estilo páginas de producto de Apple, con uso intensivo de los PNG recortados en ángulos y escalas distintas.

Fuera de alcance (YAGNI): menú de precios, pedidos, mapa/ubicación, CMS. Si se piden después, se agregan como una escena nueva.

## 2. Identidad visual
Extraída de `el-exitoso-logo.svg` y `el-exitoso-icono.svg`.

| Token | Valor | Uso |
|---|---|---|
| `--negro` | `#0B0B09` | Tipografía, fondos oscuros |
| `--naranja` | `#FF5E1D` | Color dominante, punto del logo |
| `--naranja-icono` | `#EE551F` | Perlas, detalles del icono |
| `--crema` | `#FFF3E6` | Contraste (neutro cálido, a validar) |

- Tono: bold y juvenil. Tipografía display enorme en minúsculas, como el wordmark.
- Motivo recurrente: el **punto naranja** del logo y las **perlas** de tapioca (círculos).
- Tipografía: una display condensada/gruesa en minúsculas (p. ej. Anton, Bricolage Grotesque o Archivo Black, de Google Fonts) y una sans neutra para el texto corto. Se confirma al implementar.
- El logo y el icono se usan como SVG inline.

## 3. Assets (`stock images/`)
| Archivo | Rol |
|---|---|
| `delicious-bubble-tea-drinks-arrangement-removebg-preview.png` | Trío de bebidas: protagonista del hero y del cierre |
| `pexels-rdne-6412836-removebg-preview.png` | Mano con vaso: escena 2 |
| `pexels-rdne-6412837-removebg-preview.png` | Chica tomando: escena 3 |
| `malcolm-brostrom-…jpg`, `pexels-rdne-6412828.jpg`, `arrangement-…thai-tea.jpg` | Textura de fondo en duotono naranja, baja opacidad |

Riesgo: los PNG miden unos 410×610 px. Escalados a pantalla completa se pixelan, sobre todo la chica. Mitigación: limitar la escala máxima por escena, apoyarse en bordes que salen del viewport y revisar visualmente cada una. Si no alcanza, se pedirán originales de mayor resolución.

## 4. Estructura de la página
Contenedores altos con un escenario `position: sticky` dentro. El progreso del scroll de cada escena (0 a 1) controla las animaciones.

1. **Hero (~300vh).** Fondo naranja y "el exitoso" gigante en negro, recortado por los bordes. El trío de bebidas aparece pequeño con −5° y escala hasta casi llenar la pantalla con parallax. El eslogan entra palabra por palabra. Un sello circular gira con el scroll ("bubble tea · el exitoso ·"). Un marquee con el eslogan cierra el hero.
2. **Mano con vaso (~250vh).** Entra desde abajo girando de −25° a −12°. Texto gigante detrás y perlas flotantes en 3 capas de profundidad (velocidades distintas).
3. **Chica tomando (~250vh).** El fondo transiciona de naranja a crema o negro. La foto crece desde una esquina y sale del borde. Una frase se revela línea por línea.
4. **Cierre (~150vh).** Las tres imágenes se reúnen en un collage con ángulos distintos. Aparecen el logo completo y el eslogan, con el icono del vaso como sello.

**Eslogan:** por defecto **"Pide el éxito."** (alternativas: "Tu día, con perlas.", "El éxito se toma frío."). Es un solo string de configuración, fácil de cambiar.

## 5. Animación (investigado)
Referencias: patrón sticky + progreso de scroll de las páginas de producto de Apple; Lenis + GSAP ScrollTrigger como estándar de scroll cinemático; CSS Scroll-Driven Animations nativas (`animation-timeline`, Chrome 115+, Safari 26).

Decisión: **GSAP + ScrollTrigger + Lenis**, por compatibilidad entre navegadores y control fino (pin, scrub, timelines). Lenis se acopla al ticker de GSAP para que no haya desfase.

- **Scrub y pin:** cada escena es una timeline de GSAP con `scrub` y `pin`.
- **Solo propiedades baratas:** `transform` y `opacity`, con `will-change` puntual.
- **Revelado de texto:** el texto se divide en palabras y líneas, con máscara `overflow: hidden` y entrada escalonada.
- **Parallax por capas:** las perlas y las imágenes tienen un factor de velocidad distinto.
- **Parallax con el mouse (escritorio):** las imágenes del hero se desplazan unos pocos píxeles según el cursor.
- **Sello giratorio:** texto en SVG sobre un círculo (`textPath`), con rotación atada al scroll.
- **Marquee:** CSS puro, bucle infinito, con la dirección invertida según el scroll (opcional).
- **Transición de color de fondo** entre escenas, interpolada con el scroll.
- **Micro-detalles:** grano sutil (SVG noise) sobre el fondo, y cursor personalizado con punto naranja que crece sobre las imágenes (solo en dispositivos con mouse).
- **Carga inicial:** pantalla breve con el punto naranja que se expande y revela el hero.
- **Reducir movimiento:** decisión del dueño del negocio tras probarlo (Windows con animaciones desactivadas reporta `prefers-reduced-motion: reduce` y la página quedaba estática). Las animaciones atadas al scroll se mantienen siempre; con `reduce` solo se desactivan el scroll suave (Lenis) y el parallax con el mouse. El único modo estático es una pantalla de menos de 500px de alto (móvil horizontal), controlado con `html.is-static`.
- **Gotcha de GSAP:** GSAP absorbe las propiedades CSS `translate`/`rotate`/`scale` en su transform (y pierde los `%` de `translate`). Los elementos animados se centran con márgenes y sus ángulos finales se definen en JS. Los tweens que empiezan después del inicio de una timeline usan `fromToLate` (fija el estado inicial con `gsap.set`) para sobrevivir a `ScrollTrigger.refresh()`.

## 5b. Navbar y logo principal
- **Logo principal = vaso + texto** (`LogoCompleto`), con las proporciones de la referencia del cliente: el vaso mide 1.6em con pajilla y se apoya en la línea base del texto.
- **Navbar fija:** logo completo a la izquierda y "bubble tea · hecho al momento" a la derecha (oculto en <480px). Transparente sobre el hero; al hacer scroll se vuelve una píldora crema translúcida. Se esconde al bajar y reaparece al subir.
- El logo completo también se usa en el hero (gigante, perlas en crema), el loader y el cierre.

## 6. Imágenes (rendimiento)
- PNG convertidos a **WebP** (alpha conservado) en 2 anchos, con `srcset`/`sizes`. AVIF se descarta por ahora (soporte desigual y poco beneficio con estos tamaños).
- La imagen del hero **no** usa lazy-load (es el LCP) y lleva `fetchpriority="high"`. Las demás usan `loading="lazy"` y `decoding="async"`.
- Todas con `width`/`height` explícitos para evitar saltos de layout.
- Los JPG de fondo se convierten a WebP y se tiñen con duotono por CSS (`mix-blend-mode`).

## 7. Arquitectura (Vite + React)
```
el-exitoso/
  index.html
  src/
    main.jsx            # monta App
    App.jsx             # orquesta escenas, inicializa Lenis + GSAP
    styles/             # tokens.css (colores/tipo), global.css
    scenes/             # Hero, ManoVaso, ChicaTomando, Cierre (una por archivo)
    components/         # Logo, IconoVaso, SelloGiratorio, Marquee, Perlas, RevealText, Cursor, Loader
    hooks/              # useReducedMotion, useLenis
    assets/             # imágenes optimizadas, SVG
  public/
```
Cada escena es independiente: recibe su contenedor, crea su timeline en `useLayoutEffect` y la limpia al desmontar (`gsap.context`). Los componentes de `components/` no conocen las escenas.

## 8. Responsive
Meta: sin desbordes, recortes indeseados ni saltos de layout de 360 a 1920+ px. No se promete "100%" sin verificación; se verifica (ver sección 9).

- **Breakpoints:** 360, 480, 768, 1024, 1440 y 1920+ px. Entre ellos, texto, imágenes y espacios usan `clamp()` y unidades relativas, no valores fijos.
- **Altura de escenas:** unidades `svh`/`dvh` (no `100vh`) para que la barra del navegador móvil no rompa los escenarios fijos.
- **Scroll:** nativo en móvil/touch (sin Lenis). Lenis solo en escritorio con puntero fino.
- **Escritorio (≥1024px):** composición completa, cursor personalizado, parallax con mouse. Ancho máximo del contenido con límite para pantallas ultra anchas.
- **Tablet (768–1023px):** composición intermedia, ángulos reducidos.
- **Móvil (<768px):** composición propia (no solo reducida): imágenes escaladas por ancho y apiladas, escenas ≈60% de la altura, ángulos reducidos, sin cursor personalizado ni parallax con mouse.
- **Orientación horizontal en móvil:** se revisa por separado; si la altura es menor a ~500px, las escenas bajan a layout sin pin.
- **Imágenes:** `srcset`/`sizes` por ancho; escala máxima limitada para evitar pixelado.
- **Rendimiento:** 60 fps en un móvil de gama media, revisado en emulación y, si es posible, en un dispositivo real.

## 9. Verificación
- Revisión visual en el navegador a 360, 768, 1024, 1440 y 1920 px, más móvil en horizontal, escena por escena, con capturas y especial atención a la nitidez de las imágenes escaladas. Sin scroll horizontal en ningún ancho.
- Lighthouse (rendimiento, accesibilidad) como referencia, sin perseguir una puntuación exacta.
- Prueba con `prefers-reduced-motion` activado.
- `npm run build` sin errores ni advertencias.

## 10. Pendientes abiertos
- Eslogan definitivo (se usa "Pide el éxito." hasta que se indique otro).
- Tipografía display final.
- Fondo de la escena 3 (crema o negro), a decidir al ver la composición real.
