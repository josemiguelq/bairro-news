<template>
  <article class="card">

    <div class="card-image" :style="announcement.image ? { backgroundImage: `url(${announcement.image})` } : {}">
      <div
        v-if="!announcement.image"
        class="card-noimage"
        :style="{ background: announcement.color || 'var(--accent)' }"
      >
        <span class="card-noimage-title">{{ announcement.title }}</span>
      </div>
      <span v-if="announcement.order != null" class="card-order">{{ announcement.order }}</span>

    </div>

    <div class="card-footer">
      <div class="card-tags">
        <span v-if="announcement.category" class="ctag ctag-cat">{{ announcement.category }}</span>
        <span v-if="announcement.time" class="ctag">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l3.5 2"/></svg>
          {{ announcement.time }}
        </span>
        <span v-if="announcement.location" class="ctag ctag-location">
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
          {{ announcement.location }}
        </span>
      </div>
      <button class="share-icon-btn" @click.stop="share" title="Compartilhar no WhatsApp">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 2C6.477 2 2 6.477 2 12c0 1.99.574 3.846 1.567 5.41L2 22l4.702-1.545A9.953 9.953 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" fill="none" stroke="currentColor" stroke-width="1.5"/>
        </svg>
      </button>
    </div>

    <div class="card-accent" :style="{ background: announcement.color || 'var(--accent)' }"></div>
  </article>
</template>

<script setup>
import { formatDate } from '@/services/jsonService.js'

const props = defineProps({ announcement: { type: Object, required: true } })

async function share() {
  const parts = [
    props.announcement.title,
    props.announcement.subtitle,
    props.announcement.date ? formatDate(props.announcement.date) : null,
    props.announcement.time ? `às ${props.announcement.time}` : null,
    props.announcement.location || null
  ].filter(Boolean)

  const text = parts.join(' · ')

  // Tenta Web Share API (funciona no mobile e alguns navegadores modernos)
  if (navigator.share) {
    try {
      const shareData = { title: props.announcement.title || 'Anúncio', text }
      // Inclui imagem se for URL externa (não caminho local)
      if (props.announcement.image?.startsWith('http')) {
        shareData.url = props.announcement.image
      }
      await navigator.share(shareData)
      return
    } catch (e) {
      if (e.name === 'AbortError') return // usuário cancelou
    }
  }

  // Fallback: abre WhatsApp Web com o texto
  const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`
  window.open(waUrl, '_blank', 'noopener')
}
</script>

<style scoped>
.card {
  position: relative;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
  display: flex;
  flex-direction: column;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
  border-color: var(--border-2);
}

/* ── Imagem ─────────────────────────── */

.card-image {
  position: relative;
  aspect-ratio: 16/9;
  background-size: cover;
  background-position: center;
  background-color: var(--surface-2);
  overflow: hidden;
}

.card-noimage {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.card-noimage-title {
  font-size: clamp(15px, 2vw, 22px);
  font-weight: 800;
  color: rgba(255,255,255,0.9);
  text-align: center;
  line-height: 1.2;
  letter-spacing: -0.02em;
  text-shadow: 0 2px 12px rgba(0,0,0,0.4);
}

.card-order {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.2);
  color: rgba(255,255,255,0.7);
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── Footer com tags ────────────────── */

.card-footer {
  padding: 10px 14px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.card-tags {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  flex: 1;
  min-width: 0;
}

/* ── Ícone compartilhar ─────────────── */

.share-icon-btn {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(37, 211, 102, 0.12);
  border: 1px solid rgba(37, 211, 102, 0.25);
  color: #25d366;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}

.share-icon-btn:hover {
  background: #25d366;
  color: #fff;
  transform: scale(1.1);
}

.ctag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 600;
  background: var(--surface-2);
  color: var(--text-muted);
  border: 1px solid var(--border);
  white-space: nowrap;
}

.ctag-cat {
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: 10px;
}

.ctag-location {
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-accent {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  opacity: 0;
  transition: opacity 0.22s;
}

.card:hover .card-accent { opacity: 1; }
</style>
