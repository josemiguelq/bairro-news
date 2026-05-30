'use client'

import { useEffect, useState } from 'react'
import AnnouncementCard from '@/components/AnnouncementCard'
import { Announcement, formatDate } from '@/lib/types'
import styles from './page.module.css'

interface Group { date: string; items: Announcement[] }

export default function HistoricoPage() {
  const [groups, setGroups] = useState<Group[]>([])
  const [search, setSearch] = useState('')
  const [monthFilter, setMonthFilter] = useState('')
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/data/index.json').then(r => r.json()).then(async (dates: string[]) => {
      const all: Group[] = await Promise.all(dates.map(async date => {
        const res = await fetch(`/data/${date}.json`)
        const data = await res.json()
        return { date, items: data.announcements as Announcement[] }
      }))
      setGroups(all)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const months = [...new Set(groups.map(g => g.date.slice(0, 7)))].sort().reverse()
    .map(m => {
      const [y, mo] = m.split('-')
      const label = new Date(+y, +mo-1).toLocaleDateString('pt-BR', { month:'long', year:'numeric' })
      return { value: m, label: label.charAt(0).toUpperCase() + label.slice(1) }
    })

  const filtered = groups.filter(g => {
    if (monthFilter && !g.date.startsWith(monthFilter)) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      return g.items.some(a => [a.title, a.subtitle, a.category, a.location].some(v => v?.toLowerCase().includes(q)))
    }
    return true
  })

  function toggle(date: string) {
    setExpanded(prev => { const s = new Set(prev); s.has(date) ? s.delete(date) : s.add(date); return s })
  }

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1 className="page-title">Histórico</h1>
        <p className="page-subtitle">Todos os anúncios cadastrados</p>
      </div>

      <div className={styles.searchBar}>
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}>🔍</span>
          <input className="form-input" style={{ paddingLeft:40 }} placeholder="Pesquisar…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-input" style={{ width:200, flexShrink:0 }} value={monthFilter} onChange={e => setMonthFilter(e.target.value)}>
          <option value="">Todos os meses</option>
          {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
        </select>
      </div>

      {loading ? <div className="state-empty"><div className="spinner" /></div> : (
        <div className={styles.list}>
          {filtered.length === 0 ? <div className="state-empty"><p>Nenhum resultado.</p></div> : filtered.map(g => (
            <div key={g.date} className={styles.group}>
              <button className={styles.dateRow} onClick={() => toggle(g.date)}>
                <div className={styles.dateInfo}>
                  <span className={styles.dateLabel}>{formatDate(g.date)}</span>
                  <span className={styles.dateCount}>{g.items.length} {g.items.length===1?'anúncio':'anúncios'}</span>
                </div>
                <span style={{ transform: expanded.has(g.date)?'rotate(180deg)':'none', transition:'transform .2s', display:'inline-block' }}>▾</span>
              </button>
              {expanded.has(g.date) && (
                <div className={styles.cards}>
                  {g.items.map(a => <AnnouncementCard key={a.id} announcement={a} />)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
