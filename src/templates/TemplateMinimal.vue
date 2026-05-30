<template>
  <div class="template-minimal" :style="{ '--accent-color': announcement.color || '#0f766e' }">
    <div class="accent-bar"></div>
    <div class="content">
      <div class="top-row">
        <div class="category">{{ announcement.category }}</div>
        <img src="/assets/logos/logo-bairro.png" alt="Logo" class="logo" />
      </div>
      <div class="main">
        <h1 class="title">{{ announcement.title }}</h1>
        <p class="subtitle" v-if="announcement.subtitle">{{ announcement.subtitle }}</p>
      </div>
      <div class="footer">
        <div class="meta-items">
          <div class="meta-chip" v-if="announcement.date">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
            {{ formatDate(announcement.date) }}
          </div>
          <div class="meta-chip" v-if="announcement.time">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            {{ announcement.time }}
          </div>
          <div class="meta-chip" v-if="announcement.location">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
            {{ announcement.location }}
          </div>
        </div>
        <div class="church-tag">IASD Bairro Amambaí</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatDate } from '@/services/jsonService.js'
defineProps({ announcement: { type: Object, required: true } })
</script>

<style scoped>
.template-minimal {
  position: relative;
  width: 1280px;
  height: 720px;
  background: color-mix(in srgb, var(--accent-color) 12%, #0a0a0f);
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  color: #fff;
  flex-shrink: 0;
}

.accent-bar {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 6px;
  background: var(--accent-color);
}

.content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 56px 72px;
}

.top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.category {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--accent-color);
  background: color-mix(in srgb, var(--accent-color) 15%, transparent);
  padding: 6px 16px;
  border-radius: 100px;
  border: 1px solid color-mix(in srgb, var(--accent-color) 30%, transparent);
}

.logo {
  width: 48px;
  height: 48px;
  opacity: 0.6;
}

.main {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.title {
  font-size: 80px;
  font-weight: 800;
  line-height: 1.0;
  letter-spacing: -0.03em;
  color: #fff;
  max-width: 1000px;
}

.subtitle {
  font-size: 28px;
  font-weight: 400;
  color: rgba(255,255,255,0.55);
  max-width: 700px;
}

.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.meta-items {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.meta-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 17px;
  font-weight: 500;
  color: rgba(255,255,255,0.7);
}

.church-tag {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: rgba(255,255,255,0.25);
  text-transform: uppercase;
}
</style>
