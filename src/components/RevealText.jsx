import './RevealText.css'

/**
 * Divide el texto en líneas y palabras con máscara, para animar
 * `.reveal__word` (yPercent 110 → 0). Accesible: el texto completo va en aria-label.
 */
export function RevealText({ lines, as: Tag = 'p', className = '' }) {
  const arr = Array.isArray(lines) ? lines : [lines]
  return (
    <Tag className={`reveal ${className}`} aria-label={arr.join(' ')}>
      {arr.map((line, i) => (
        <span className="reveal__line" key={i} aria-hidden="true">
          {line.split(' ').map((word, j) => (
            <span className="reveal__mask" key={j}>
              <span className="reveal__word">{word}</span>
            </span>
          ))}
        </span>
      ))}
    </Tag>
  )
}
