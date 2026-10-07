import { useMemo } from 'react'
import './Perlas.css'

// Pseudoaleatorio con semilla: las perlas quedan siempre en el mismo lugar.
function seeded(seed) {
  let s = seed % 2147483647 || 1
  return () => (s = (s * 16807) % 2147483647) / 2147483647
}

/** Perlas de tapioca flotantes. data-depth (1–3) define la velocidad de parallax. */
export function Perlas({ count = 14, seed = 7, colors = ['var(--negro)', 'var(--naranja)'], className = '' }) {
  const items = useMemo(() => {
    const r = seeded(seed)
    return Array.from({ length: count }, (_, i) => {
      const size = 12 + r() * 46
      return {
        x: r() * 96,
        y: 4 + r() * 92,
        size,
        depth: 1 + Math.floor(r() * 3),
        color: colors[i % colors.length],
      }
    })
  }, [count, seed, colors])

  return (
    <div className={`perlas ${className}`} aria-hidden="true">
      {items.map((p, i) => (
        <span
          key={i}
          className="perla"
          data-depth={p.depth}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            '--s': `clamp(${(p.size * 0.5).toFixed(0)}px, ${(p.size / 14).toFixed(2)}vw, ${p.size.toFixed(0)}px)`,
            '--c': p.color,
          }}
        />
      ))}
    </div>
  )
}
