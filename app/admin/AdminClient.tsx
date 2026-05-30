'use client'

import { useState } from 'react'
import { Announcement, formatDate } from '@/lib/types'
import styles from './admin.module.css'

interface DayData { date: string; announcements: Announcement[] }

const blank = (): Omit<Announcement, 'id' | 'createdAt'> => ({
  date: '',
  category: '',
  order: 1,
  template: 'modern',
  title: '',
  subtitle: '',
  time: '',
  location: 'IASD Bairro Amambaí',
  color: '#d4a520',
  image: '',
  showOnScreen: true,
  duration: 10
})

export default function AdminClient({ existingData }: { existingData: DayData[] }) {
  const [view, setView] = useState<'list' | 'new' | 'edit'>('list')
  const [editDate, setEditDate] = useState('')
  const [date, setDate] = useState('')
  const [items, setItems] = useState<Partial<Announcement>[]>([{ ...blank(), order: 1 }])
  const [exported, setExported] = useState(false)

  function startNew() {
    setDate('')
    setItems([{ ...blank(), order: 1 }])
    setExported(false)
    setView('new')
  }

  function startEdit(d: DayData) {
    setEditDate(d.date)
    setDate(d.date)
    setItems(d.announcements.map(a => ({ ...a })))
    setExported(false)
    setView('edit')
  }

  function addItem() {
    setItems(prev => [...prev, { ...blank(), date, order: prev.length + 1 }])
  }

  function removeItem(i: number) {
    setItems(prev => prev.filter((_, idx) => idx !== i))
  }

  function updateItem(i: number, field: string, value: unknown) {
    setItems(prev => prev.map((item, idx) => idx === i ? { ...item, [field]: value } : item))
  }

  function exportJSON() {
    const announcements = items.map((item, i) => ({
      id: (item as Announcement).id || crypto.randomUUID(),
      template: item.template || 'modern',
      title: item.title || '',
      subtitle: item.subtitle || '',
      date,
      time: item.time || '',
      location: item.location || '',
      category: item.category || '',
      color: item.color || '#d4a520',
      image: item.image || '',
      showOnScreen: item.showOnScreen ?? true,
      duration: item.duration || 10,
      order: item.order ?? i + 1,
      createdAt: (item as Announcement).createdAt || new Date().toISOString()
    }))

    // Download YYYY-MM-DD.json
    download({ announcements }, `${date}.json`)

    // Update index
    const allDates = [...new Set([date, ...existingData.map(d => d.date)])].sort().reverse()
    setTimeout(() => download(allDates, 'index.json'), 300)

    setExported(true)
  }

  function download(data: unknown, filename: string) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = filename; a.click()
    URL.revokeObjectURL(url)
  }

  const canExport = date && items.length > 0 && items.every(it => it.category && it.order != null)

  if (view === 'list') return (
    <div>
      <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:24 }}>
        <button className="btn btn-primary" onClick={startNew}>+ Novo dia de anúncios</button>
      </div>

      {existingData.length === 0 ? (
        <div className="state-empty"><p>Nenhum sábado cadastrado ainda.</p></div>
      ) : (
        <div className={styles.list}>
          {existingData.map(d => (
            <div key={d.date} className={styles.dayRow}>
              <div>
                <div className={styles.dayDate}>{formatDate(d.date)}</div>
                <div className={styles.dayCount}>{d.announcements.length} anúncio(s)</div>
              </div>
              <button className="btn btn-ghost" onClick={() => startEdit(d)}>Editar</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className={styles.form}>
      <div className={styles.formHeader}>
        <button className={styles.back} onClick={() => setView('list')}>← Voltar</button>
        <h2 className={styles.formTitle}>{view === 'new' ? 'Novo dia de anúncios' : `Editar ${formatDate(editDate)}`}</h2>
      </div>

      {/* Data */}
      <div className={styles.section}>
        <label className="form-label">Data do Sábado *</label>
        <input type="date" className="form-input" style={{ maxWidth:220 }}
          value={date} onChange={e => {
            setDate(e.target.value)
            setItems(prev => prev.map(it => ({ ...it, date: e.target.value })))
          }} required />
      </div>

      {/* Anúncios */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Anúncios <span className={styles.badge}>{items.length}</span></h3>
          <button className="btn btn-ghost" onClick={addItem}>+ Adicionar</button>
        </div>

        <div className={styles.items}>
          {items.map((item, i) => (
            <div key={i} className={styles.item}>
              <div className={styles.itemHeader}>
                <span className={styles.itemNum}>#{i + 1}</span>
                <button className="btn btn-danger" style={{ padding:'4px 10px', fontSize:12 }} onClick={() => removeItem(i)}>Remover</button>
              </div>

              <div className={styles.grid2}>
                <div>
                  <label className="form-label">Categoria *</label>
                  <input className="form-input" placeholder="jovens, culto, música…" value={item.category || ''} onChange={e => updateItem(i, 'category', e.target.value)} required />
                </div>
                <div>
                  <label className="form-label">Ordem *</label>
                  <input type="number" min={1} className="form-input" value={item.order ?? i+1} onChange={e => updateItem(i, 'order', +e.target.value)} required />
                </div>
                <div>
                  <label className="form-label">Horário</label>
                  <input type="time" className="form-input" value={item.time || ''} onChange={e => updateItem(i, 'time', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Duração no Telão (s)</label>
                  <input type="number" min={5} max={60} className="form-input" value={item.duration || 10} onChange={e => updateItem(i, 'duration', +e.target.value)} />
                </div>
                <div className={styles.span2}>
                  <label className="form-label">URL da Imagem (arte)</label>
                  <input className="form-input" placeholder="https://… ou ./../../artes-anuncios/…" value={item.image || ''} onChange={e => updateItem(i, 'image', e.target.value)} />
                </div>
                <div className={styles.span2}>
                  <label className="form-label">Local</label>
                  <input className="form-input" value={item.location || ''} onChange={e => updateItem(i, 'location', e.target.value)} />
                </div>
                <div className={styles.span2} style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <label className="form-label" style={{ margin:0 }}>Exibir no Telão</label>
                  <input type="checkbox" checked={item.showOnScreen ?? true} onChange={e => updateItem(i, 'showOnScreen', e.target.checked)}
                    style={{ width:18, height:18, accentColor:'var(--accent)', cursor:'pointer' }} />
                </div>
              </div>

              {item.image && (
                <div className={styles.preview}>
                  <img src={item.image} alt="preview" onError={e => (e.currentTarget.style.display='none')} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Export */}
      <div className={styles.exportSection}>
        {exported && (
          <p className={styles.exportMsg}>
            ✓ {items.length + 1} arquivo(s) baixados — coloque em <code>public/data/</code> e faça commit no GitHub
          </p>
        )}
        <button className="btn btn-primary" style={{ minWidth:200 }} disabled={!canExport} onClick={exportJSON}>
          ⬇ Gerar JSON
        </button>
        {!canExport && <p style={{ fontSize:13, color:'var(--text-muted)', marginTop:8 }}>Preencha data, categoria e ordem em todos os anúncios</p>}
      </div>
    </div>
  )
}
