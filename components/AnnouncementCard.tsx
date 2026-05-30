'use client'

import { Announcement, formatDate } from '@/lib/types'
import styles from './AnnouncementCard.module.css'

interface Props { announcement: Announcement }

export default function AnnouncementCard({ announcement: a }: Props) {
  async function share() {
    const parts = [a.title, a.subtitle, a.date ? formatDate(a.date) : null,
      a.time ? `às ${a.time}` : null, a.location].filter(Boolean)
    const text = parts.join(' · ')

    if (a.image && navigator.canShare) {
      try {
        const res = await fetch(a.image)
        const blob = await res.blob()
        const file = new File([blob], 'anuncio.jpg', { type: blob.type })
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: a.title || 'Anúncio', text })
          return
        }
      } catch {}
    }

    if (navigator.share) {
      try { await navigator.share({ title: a.title || 'Anúncio', text }); return } catch {}
    }

    // Desktop fallback: baixa imagem + abre WhatsApp
    if (a.image) {
      try {
        const res = await fetch(a.image)
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const dl = document.createElement('a')
        dl.href = url; dl.download = 'anuncio.jpg'; dl.click()
        URL.revokeObjectURL(url)
      } catch {}
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener')
  }

  return (
    <article className={styles.card}>
      <div className={styles.image}
        style={a.image ? { backgroundImage: `url(${a.image})` } : {}}>
        {!a.image && (
          <div className={styles.noimage} style={{ background: a.color || 'var(--accent)' }}>
            <span>{a.title}</span>
          </div>
        )}
        {a.order != null && <span className={styles.order}>{a.order}</span>}
      </div>
      <div className={styles.footer}>
        <div className={styles.tags}>
          {a.category && <span className={`${styles.tag} ${styles.cat}`}>{a.category}</span>}
          {a.time && <span className={styles.tag}>⏰ {a.time}</span>}
          {a.location && <span className={`${styles.tag} ${styles.loc}`}>📍 {a.location}</span>}
        </div>
        <button className={styles.shareBtn} onClick={share} title="Compartilhar">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 2C6.477 2 2 6.477 2 12c0 1.99.574 3.846 1.567 5.41L2 22l4.702-1.545A9.953 9.953 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        </button>
      </div>
      <div className={styles.accent} style={{ background: a.color || 'var(--accent)' }} />
    </article>
  )
}
