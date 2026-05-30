<template>
  <div class="template-classic">
    <div class="bg-image" v-if="announcement.image" :style="{ backgroundImage: `url(${announcement.image})` }"></div>
    <div class="overlay"></div>
    <div class="border-frame">
      <div class="border-corner tl"></div>
      <div class="border-corner tr"></div>
      <div class="border-corner bl"></div>
      <div class="border-corner br"></div>
    </div>
    <div class="content">
      <div class="top">
        <img src="/assets/logos/logo-bairro.png" alt="Logo" class="logo" />
        <div class="church-name">IASD Bairro Amambaí</div>
      </div>
      <div class="middle">
        <div class="divider-line"></div>
        <h1 class="title">{{ announcement.title }}</h1>
        <div class="divider-line"></div>
        <p class="subtitle" v-if="announcement.subtitle">{{ announcement.subtitle }}</p>
      </div>
      <div class="bottom">
        <div class="meta-row">
          <span v-if="announcement.date">{{ formatDate(announcement.date) }}</span>
          <span class="dot" v-if="announcement.date && announcement.time">·</span>
          <span v-if="announcement.time">{{ announcement.time }}</span>
          <span class="dot" v-if="announcement.location">·</span>
          <span v-if="announcement.location">{{ announcement.location }}</span>
        </div>
        <div class="category-tag" v-if="announcement.category">{{ announcement.category }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatDate } from '@/services/jsonService.js'
defineProps({ announcement: { type: Object, required: true } })
</script>

<style scoped>
.template-classic {
  position: relative;
  width: 1280px;
  height: 720px;
  background: #1a1206;
  overflow: hidden;
  font-family: 'Playfair Display', Georgia, serif;
  color: #f5e6c8;
  flex-shrink: 0;
}

.bg-image {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  filter: blur(12px) brightness(0.15) sepia(0.5);
  transform: scale(1.1);
}

.overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, rgba(26,18,6,0.5) 0%, rgba(26,18,6,0.95) 100%);
}

.border-frame {
  position: absolute;
  inset: 28px;
  border: 1px solid rgba(201,168,76,0.3);
  pointer-events: none;
}

.border-corner {
  position: absolute;
  width: 20px;
  height: 20px;
  border-color: #c9a84c;
  border-style: solid;
}
.border-corner.tl { top: -1px; left: -1px; border-width: 2px 0 0 2px; }
.border-corner.tr { top: -1px; right: -1px; border-width: 2px 2px 0 0; }
.border-corner.bl { bottom: -1px; left: -1px; border-width: 0 0 2px 2px; }
.border-corner.br { bottom: -1px; right: -1px; border-width: 0 2px 2px 0; }

.content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 52px 80px;
  text-align: center;
}

.top {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.logo { width: 52px; height: 52px; opacity: 0.85; }

.church-name {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #c9a84c;
  opacity: 0.8;
}

.middle {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  max-width: 900px;
}

.divider-line {
  width: 120px;
  height: 1px;
  background: linear-gradient(to right, transparent, #c9a84c, transparent);
}

.title {
  font-size: 68px;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.01em;
  color: #f5e6c8;
  text-shadow: 0 2px 20px rgba(201,168,76,0.3);
}

.subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 22px;
  font-weight: 400;
  color: rgba(245,230,200,0.65);
  font-style: italic;
}

.bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.meta-row {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: 'Inter', sans-serif;
  font-size: 17px;
  color: #c9a84c;
  font-weight: 500;
}

.dot { opacity: 0.4; }

.category-tag {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(201,168,76,0.5);
}
</style>
