<template>
  <div class="slide">

    <!-- COM IMAGEM: arte em tela cheia, texto mínimo embaixo -->
    <template v-if="announcement.image">
      <div
        class="slide-image"
        :style="{ backgroundImage: `url(${announcement.image})` }"
      ></div>
      <div class="slide-vignette"></div>
      <div class="slide-bar">
        <div class="slide-tags">
          <span v-if="announcement.category" class="stag stag-cat">{{ announcement.category }}</span>
          <span v-if="announcement.time" class="stag">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l3.5 2"/></svg>
            {{ announcement.time }}
          </span>
          <span v-if="announcement.location" class="stag">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
            {{ announcement.location }}
          </span>
        </div>
        <img src="/assets/logos/logo-bairro.png" alt="Logo" class="slide-logo" />
      </div>
    </template>

    <!-- SEM IMAGEM: fallback com texto centralizado -->
    <template v-else>
      <div class="slide-fallback" :style="{ '--fc': announcement.color || '#6366f1' }">
        <div class="slide-fallback-body">
          <span v-if="announcement.category" class="stag stag-cat stag-large">{{ announcement.category }}</span>
          <h1 class="slide-fallback-title">{{ announcement.title }}</h1>
          <p v-if="announcement.subtitle" class="slide-fallback-sub">{{ announcement.subtitle }}</p>
          <div class="slide-tags">
            <span v-if="announcement.time" class="stag stag-large">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l3.5 2"/></svg>
              {{ announcement.time }}
            </span>
            <span v-if="announcement.location" class="stag stag-large">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
              {{ announcement.location }}
            </span>
          </div>
        </div>
        <img src="/assets/logos/logo-bairro.png" alt="Logo" class="slide-logo slide-logo-fallback" />
      </div>
    </template>

  </div>
</template>

<script setup>
defineProps({ announcement: { type: Object, required: true } })
</script>

<style scoped>
.slide {
  width: 100%;
  height: 100%;
  position: relative;
  background: #000;
  overflow: hidden;
}

/* ── COM IMAGEM ─────────────────────────────── */

.slide-image {
  position: absolute;
  inset: 0;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

/* vinheta sutil só nas bordas e embaixo */
.slide-vignette {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to top,  rgba(0,0,0,0.75) 0%, transparent 18%),
    linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, transparent 10%),
    linear-gradient(to right,  rgba(0,0,0,0.15) 0%, transparent 8%),
    linear-gradient(to left,   rgba(0,0,0,0.15) 0%, transparent 8%);
}

/* barra de tags na base */
.slide-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: clamp(16px, 2.5vw, 32px) clamp(20px, 3.5vw, 48px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.slide-tags {
  display: flex;
  align-items: center;
  gap: clamp(6px, 1vw, 12px);
  flex-wrap: wrap;
}

.stag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: clamp(4px, 0.6vw, 7px) clamp(10px, 1.2vw, 16px);
  border-radius: 100px;
  font-size: clamp(11px, 1.1vw, 15px);
  font-weight: 600;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(10px);
  color: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(255, 255, 255, 0.15);
  white-space: nowrap;
  letter-spacing: 0.01em;
}

.stag-cat {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: clamp(10px, 0.9vw, 13px);
  background: rgba(0, 0, 0, 0.65);
  color: rgba(255, 255, 255, 0.7);
}

.stag-large {
  font-size: clamp(13px, 1.4vw, 19px);
  padding: clamp(6px, 0.8vw, 10px) clamp(14px, 1.6vw, 22px);
}

.slide-logo {
  width: clamp(28px, 3vw, 42px);
  height: clamp(28px, 3vw, 42px);
  opacity: 0.45;
  flex-shrink: 0;
}

/* ── SEM IMAGEM ─────────────────────────────── */

.slide-fallback {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 30% 40%, color-mix(in srgb, var(--fc) 30%, #050810) 0%, #050810 70%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.slide-fallback-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(12px, 2vw, 28px);
  text-align: center;
  padding: clamp(32px, 5vw, 80px);
  max-width: 85%;
}

.slide-fallback-title {
  font-size: clamp(40px, 8vw, 110px);
  font-weight: 900;
  line-height: 1.0;
  letter-spacing: -0.03em;
  color: #fff;
  text-shadow: 0 4px 40px rgba(0,0,0,0.6);
}

.slide-fallback-sub {
  font-size: clamp(16px, 2.2vw, 30px);
  color: rgba(255, 255, 255, 0.55);
  font-weight: 400;
}

.slide-logo-fallback {
  position: absolute;
  top: clamp(20px, 3vw, 40px);
  right: clamp(20px, 3vw, 40px);
}
</style>
