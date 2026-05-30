'use client'

import { useEffect, useState } from 'react'
import AnnouncementCard from '@/components/AnnouncementCard'
import { Announcement, formatDate } from '@/lib/types'
import styles from './page.module.css'

interface DayData { date: string; announcements: Announcement[] }

export default function HomePage() {
  const [days, setDays] = useState<DayData[]>([])
  const [current, setCurrent] = useState(0)
  const [filter, setFilter] = useState('todos')
  const [showPrev, setShowPrev] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/data/index.json')
      .then(r => r.json())
      .then(async (dates: string[]) => {
        const all: DayData[] = await Promise.all(
          dates.map(async (date) => {
            const res = await fetch(`/data/${date}.json`)
            const data = await res.json()
            const items = (data.announcements as Announcement[])
              .filter(a => a.showOnScreen)
              .sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999))
            return { date, announcements: items }
          })
        )
        setDays(all)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const day = days[current]
  const categories = day ? [...new Set(day.announcements.map(a => a.category))] : []
  const filtered = day ? (filter === 'todos' ? day.announcements : day.announcements.filter(a => a.category === filter)) : []

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1 className="page-title">Anúncios do Dia</h1>
        <p className="page-subtitle">{day ? formatDate(day.date) : '—'}</p>
      </div>

      {loading ? (
        <div className="state-empty"><div className="spinner" /></div>
      ) : (
        <>
          <div className={styles.toolbar}>
            <div className={styles.filters}>
              {['todos', ...categories].map(cat => (
                <button key={cat} className={`${styles.filterBtn} ${filter === cat ? styles.active : ''}`} onClick={() => setFilter(cat)}>{cat}</button>
              ))}
            </div>
            {days.length > 1 && (
              <div className={styles.prevWrap}>
                <button className={styles.prevBtn} onClick={() => setShowPrev(v => !v)}>
                  ← Ver sábados anteriores
                </button>
                {showPrev && (
                  <div className={styles.dropdown}>
                    {days.slice(1).map((d, i) => (
                      <button key={d.date} className={styles.dateBtn} onClick={() => { setCurrent(i+1); setFilter('todos'); setShowPrev(false) }}>
                        📅 {formatDate(d.date)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {current > 0 && (
            <div className={styles.pastBanner}>
              <span>Sábado {formatDate(day.date)}</span>
              <button onClick={() => { setCurrent(0); setFilter('todos') }}>← Mais recente</button>
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="state-empty"><p>Nenhum anúncio para este sábado.</p></div>
          ) : (
            <div className={styles.grid}>
              {filtered.map(a => <AnnouncementCard key={a.id} announcement={a} />)}
            </div>
          )}
        </>
      )}
    </div>
  )
}
