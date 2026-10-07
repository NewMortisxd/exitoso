// Comprime el video del final y genera su portada.
// Uso: npm run video
import ffmpeg from 'ffmpeg-static'
import { execFileSync } from 'node:child_process'
import { statSync } from 'node:fs'

const SRC = 'src/assets/vid/Estupidez.mp4'
const OUT = 'src/assets/vid/publico.mp4'
const POSTER = 'src/assets/vid/publico-poster.webp'

const run = (args) => execFileSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: 'inherit' })

// H.264 + AAC para que funcione en todos los navegadores; faststart = empieza a reproducir antes de bajar todo.
run(['-i', SRC, '-c:v', 'libx264', '-preset', 'slow', '-crf', '27', '-vf', 'scale=540:-2', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart', OUT])
// Portada: el fotograma de la "pelea" a mitad del video.
run(['-ss', '7.9', '-i', SRC, '-frames:v', '1', '-vf', 'scale=540:-2', '-c:v', 'libwebp', '-quality', '80', POSTER])

for (const f of [SRC, OUT, POSTER]) console.log(`${f}  ${(statSync(f).size / 1024 / 1024).toFixed(2)} MB`)
