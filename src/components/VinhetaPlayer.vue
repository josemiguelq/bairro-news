<template>
  <div ref="container" class="vinheta">
    <canvas ref="canvas" class="globe-canvas"></canvas>

    <div class="stars" ref="starsEl"></div>

    <div class="vinheta-content">
      <div ref="logoWrap" class="vinheta-logo-wrap">
        <img src="/assets/logos/logo-bairro.png" alt="Logo" class="vinheta-logo" />
      </div>
      <div ref="nameEl" class="vinheta-name">Bairro Amambaí</div>
      <div ref="tagEl" class="vinheta-tag">Sistema de Anúncios</div>
    </div>

    <audio ref="audio"></audio>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'

const emit = defineEmits(['ended'])

const container = ref(null)
const canvas = ref(null)
const starsEl = ref(null)
const logoWrap = ref(null)
const nameEl = ref(null)
const tagEl = ref(null)
const audio = ref(null)

let animFrame = null
let rotation = 0

function resizeCanvas() {
  const c = canvas.value
  if (!c) return
  c.width = window.innerWidth
  c.height = window.innerHeight
}

function drawFrame() {
  const c = canvas.value
  if (!c) return

  const ctx = c.getContext('2d')
  const W = c.width
  const H = c.height
  const cx = W / 2
  const cy = H / 2
  const R = Math.min(W, H) * 0.38

  ctx.clearRect(0, 0, W, H)

  // Background
  ctx.fillStyle = '#030810'
  ctx.fillRect(0, 0, W, H)

  // Outer atmosphere halo — azul/dourado
  const haloGrad = ctx.createRadialGradient(cx, cy, R * 0.75, cx, cy, R * 1.45)
  haloGrad.addColorStop(0, 'rgba(30, 80, 180, 0.22)')
  haloGrad.addColorStop(0.5, 'rgba(20, 50, 130, 0.08)')
  haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')
  ctx.beginPath()
  ctx.arc(cx, cy, R * 1.45, 0, Math.PI * 2)
  ctx.fillStyle = haloGrad
  ctx.fill()

  // Globe fill — azul escuro profundo
  const oceanGrad = ctx.createRadialGradient(
    cx - R * 0.28, cy - R * 0.28, R * 0.05,
    cx, cy, R
  )
  oceanGrad.addColorStop(0, '#1a3a72')
  oceanGrad.addColorStop(0.4, '#0e2248')
  oceanGrad.addColorStop(0.8, '#061228')
  oceanGrad.addColorStop(1, '#020810')
  ctx.beginPath()
  ctx.arc(cx, cy, R, 0, Math.PI * 2)
  ctx.fillStyle = oceanGrad
  ctx.fill()

  // --- Grid lines (clip to sphere) ---
  ctx.save()
  ctx.beginPath()
  ctx.arc(cx, cy, R, 0, Math.PI * 2)
  ctx.clip()

  // Latitude lines
  for (let latDeg = -80; latDeg <= 80; latDeg += 20) {
    const lat = latDeg * Math.PI / 180
    const ly = cy + R * Math.sin(lat)
    const rx = R * Math.cos(lat)
    if (rx < 1) continue

    const isEquator = latDeg === 0
    const isTropic = Math.abs(latDeg) === 20 || Math.abs(latDeg) === 40
    const alpha = isEquator ? 0.55 : isTropic ? 0.28 : 0.18

    ctx.strokeStyle = `rgba(120, 170, 255, ${alpha})`
    ctx.lineWidth = isEquator ? 1.1 : 0.55
    ctx.beginPath()
    ctx.moveTo(cx - rx, ly)
    ctx.lineTo(cx + rx, ly)
    ctx.stroke()
  }

  // Longitude lines — ellipses that rotate
  const N_LON = 18
  for (let i = 0; i < N_LON; i++) {
    const theta = rotation + i * (Math.PI * 2 / N_LON)
    const cosT = Math.cos(theta)
    const rx = Math.abs(R * cosT)
    if (rx < 0.5) continue

    const depth = (cosT + 1) / 2  // 0 = back hemisphere, 1 = front
    const isMeridian = i % 3 === 0
    const alpha = isMeridian
      ? 0.08 + depth * 0.45
      : 0.04 + depth * 0.22

    ctx.strokeStyle = `rgba(90, 140, 240, ${alpha})`
    ctx.lineWidth = isMeridian
      ? 0.4 + depth * 0.7
      : 0.3 + depth * 0.3

    ctx.beginPath()
    ctx.ellipse(cx, cy, rx, R, 0, 0, Math.PI * 2)
    ctx.stroke()
  }

  ctx.restore()

  // Specular highlight (glass look)
  const specGrad = ctx.createRadialGradient(
    cx - R * 0.38, cy - R * 0.35, 0,
    cx - R * 0.38, cy - R * 0.35, R * 0.7
  )
  specGrad.addColorStop(0, 'rgba(255,255,255,0.09)')
  specGrad.addColorStop(0.5, 'rgba(255,255,255,0.025)')
  specGrad.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.beginPath()
  ctx.arc(cx, cy, R, 0, Math.PI * 2)
  ctx.fillStyle = specGrad
  ctx.fill()

  // Edge glow ring
  ctx.beginPath()
  ctx.arc(cx, cy, R, 0, Math.PI * 2)
  const edgeGrad = ctx.createLinearGradient(cx - R, cy, cx + R, cy)
  edgeGrad.addColorStop(0, 'rgba(212, 165, 32, 0.9)')
  edgeGrad.addColorStop(0.5, 'rgba(150, 110, 20, 0.4)')
  edgeGrad.addColorStop(1, 'rgba(212, 165, 32, 0.9)')
  ctx.strokeStyle = edgeGrad
  ctx.lineWidth = 1.8
  ctx.stroke()

  rotation += 0.006
  animFrame = requestAnimationFrame(drawFrame)
}

function buildStars() {
  const el = starsEl.value
  if (!el) return
  const N = 120
  let html = ''
  for (let i = 0; i < N; i++) {
    const x = Math.random() * 100
    const y = Math.random() * 100
    const size = Math.random() * 1.8 + 0.4
    const opacity = Math.random() * 0.6 + 0.15
    const delay = Math.random() * 4
    html += `<span style="left:${x}%;top:${y}%;width:${size}px;height:${size}px;opacity:${opacity};animation-delay:${delay}s"></span>`
  }
  el.innerHTML = html
}

onMounted(() => {
  resizeCanvas()
  buildStars()
  drawFrame()

  audio.value.src = '/assets/vinheta.mp3'
  audio.value.load()
  audio.value.play().catch(() => {})

  gsap.set([logoWrap.value, nameEl.value, tagEl.value], { opacity: 0, y: 40 })

  const tl = gsap.timeline({ onComplete: () => emit('ended') })

  tl.to(logoWrap.value, { opacity: 1, y: 0, duration: 1.0, delay: 0.6, ease: 'power3.out' })
    .to(nameEl.value,  { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4')
    .to(tagEl.value,   { opacity: 0.55, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.35')
    .to({}, { duration: 3.5 })
    .to(container.value, { opacity: 0, duration: 1.0, ease: 'power2.inOut' })

  window.addEventListener('resize', resizeCanvas)
})

onUnmounted(() => {
  if (animFrame) cancelAnimationFrame(animFrame)
  window.removeEventListener('resize', resizeCanvas)
})
</script>

<style scoped>
.vinheta {
  position: fixed;
  inset: 0;
  z-index: 20;
  overflow: hidden;
}

.globe-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

/* Stars */
.stars {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.stars :deep(span) {
  position: absolute;
  border-radius: 50%;
  background: #fff;
  animation: twinkle 3s ease-in-out infinite alternate;
}

@keyframes twinkle {
  from { opacity: var(--base-opacity, 0.3); }
  to   { opacity: calc(var(--base-opacity, 0.3) * 0.3); }
}

.vinheta-content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  pointer-events: none;
}

.vinheta-logo-wrap {
  filter: drop-shadow(0 0 24px rgba(212, 165, 32, 0.8));
}

.vinheta-logo {
  width: clamp(72px, 10vw, 120px);
  height: clamp(72px, 10vw, 120px);
}

.vinheta-name {
  font-family: 'Inter', sans-serif;
  font-size: clamp(22px, 3.5vw, 52px);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #fff;
  text-align: center;
  text-shadow: 0 0 60px rgba(212, 165, 32, 0.5), 0 2px 20px rgba(0,0,0,0.8);
}

.vinheta-tag {
  font-family: 'Inter', sans-serif;
  font-size: clamp(11px, 1.4vw, 18px);
  font-weight: 500;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: rgba(160, 180, 255, 0.55);
  text-align: center;
}
</style>
