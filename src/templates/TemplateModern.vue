<template>
  <div class="template-modern" :style="{ '--accent-color': announcement.color || '#6366f1' }">
    <div class="bg-image" v-if="announcement.image" :style="{ backgroundImage: `url(${announcement.image})` }"></div>
    <div class="overlay"></div>
    <div class="glow-orb"></div>
    <div class="content">
      <div class="category-badge">
        <span>{{ announcement.category }}</span>
      </div>
      <h1 class="title">{{ announcement.title }}</h1>
      <p class="subtitle" v-if="announcement.subtitle">{{ announcement.subtitle }}</p>
      <div class="meta">
        <div class="meta-item" v-if="announcement.date">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
          {{ formatDate(announcement.date) }}
        </div>
        <div class="meta-item" v-if="announcement.time">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          {{ announcement.time }}
        </div>
        <div class="meta-item" v-if="announcement.location">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
          {{ announcement.location }}
        </div>
      </div>
    </div>
    <div class="logo-corner">
      <img src="/assets/logos/logo-bairro.png" alt="Logo" />
    </div>
  </div>
</template>

<script setup>
import { formatDate } from '@/services/jsonService.js'
defineProps({ announcement: { type: Object, required: true } })
</script>

<style scoped>
.template-modern {
  position: relative;
  width: 1280px;
  height: 720px;
  background: linear-gradient(135deg, #0a0a1a 0%, color-mix(in srgb, var(--accent-color) 30%, #0a0a1a) 100%);
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  color: #fff;
  flex-shrink: 0;
}

.bg-image {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  filter: blur(8px) brightness(0.25) saturate(1.5);
  transform: scale(1.1);
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(0,0,0,0.7) 0%, color-mix(in srgb, var(--accent-color) 20%, transparent) 100%);
}

.glow-orb {
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, color-mix(in srgb, var(--accent-color) 25%, transparent) 0%, transparent 70%);
  right: -100px;
  top: -100px;
  pointer-events: none;
}

.content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 64px 72px;
}

.category-badge {
  display: inline-flex;
  margin-bottom: 20px;
}

.category-badge span {
  background: var(--accent-color);
  color: #fff;
  padding: 6px 16px;
  border-radius: 100px;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.title {
  font-size: 72px;
  font-weight: 900;
  line-height: 1.0;
  letter-spacing: -0.03em;
  text-shadow: 0 2px 40px rgba(0,0,0,0.8), 0 0 80px color-mix(in srgb, var(--accent-color) 40%, transparent);
  margin-bottom: 16px;
  max-width: 900px;
}

.subtitle {
  font-size: 28px;
  font-weight: 400;
  color: rgba(255,255,255,0.75);
  margin-bottom: 32px;
  max-width: 700px;
}

.meta {
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 500;
  color: rgba(255,255,255,0.8);
}

.logo-corner {
  position: absolute;
  top: 32px;
  right: 32px;
  width: 56px;
  height: 56px;
  opacity: 0.7;
}

.logo-corner img { width: 100%; height: 100%; }
</style>
