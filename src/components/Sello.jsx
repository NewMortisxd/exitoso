import { useId } from 'react'
import './Sello.css'

/** Sello circular con texto girando. El contenedor externo lo rota el scroll; el interno gira solo. */
export function Sello({ text, className = '', center }) {
  const id = useId().replace(/:/g, '')
  return (
    <div className={`sello ${className}`} aria-hidden="true">
      <svg className="sello__spin" viewBox="0 0 200 200">
        <defs>
          <path id={`c${id}`} d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text>
          <textPath href={`#c${id}`} textLength="488">
            {text}
          </textPath>
        </text>
      </svg>
      <div className="sello__center">{center}</div>
    </div>
  )
}
