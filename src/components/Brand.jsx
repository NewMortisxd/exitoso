import logoRaw from '../assets/svg/logo.svg?raw'
import iconoRaw from '../assets/svg/icono.svg?raw'
import './Brand.css'

// Los SVG originales traen colores fijos; los cambiamos por clases para
// poder colorearlos con --logo-ink, --logo-dot y --logo-pearls según el fondo.
const prep = (raw, ink, dot) =>
  raw
    .replace(/\swidth="\d+"\s+height="\d+"/, '')
    .replace('<svg ', '<svg aria-hidden="true" focusable="false" ')
    .replace(`fill="${ink}"`, 'class="ink"')
    .replace(`fill="${dot}"`, 'class="dot"')

const logo = prep(logoRaw, '#0B0B09', '#FF5E1D')
const icono = prep(iconoRaw, '#0D0E0E', '#EE551F')

/** Solo el texto "el exitoso." */
export function Logo({ className = '', style }) {
  return <div className={`brand logo ${className}`} style={style} role="img" aria-label="el exitoso" dangerouslySetInnerHTML={{ __html: logo }} />
}

/** Solo el vaso con perlas. */
export function IconoVaso({ className = '', style }) {
  return <div className={`brand icono ${className}`} style={style} role="img" aria-label="vaso de bubble tea" dangerouslySetInnerHTML={{ __html: icono }} />
}

/**
 * Logo principal: vaso + texto. El tamaño se controla con font-size
 * (1em = alto del texto); ver Brand.css para las proporciones.
 */
export function LogoCompleto({ className = '', style }) {
  return (
    <div className={`brand logo-full ${className}`} style={style} role="img" aria-label="el exitoso">
      <span className="logo-full__icono" dangerouslySetInnerHTML={{ __html: icono }} />
      <span className="logo-full__texto" dangerouslySetInnerHTML={{ __html: logo }} />
    </div>
  )
}
