export async function fetchAnnouncements() {
  const indexRes = await fetch('/data/index.json')
  const months = await indexRes.json()

  const results = await Promise.all(
    months.map(m =>
      fetch(`/data/${m}.json`)
        .then(r => r.json())
        .then(d => d.announcements || [])
        .catch(() => [])
    )
  )

  return results.flat()
}

export function getMostRecentAnnouncements(list) {
  const withScreen = list.filter(a => a.showOnScreen)
  if (withScreen.length === 0) return []

  const today = new Date().toISOString().split('T')[0]
  const todayItems = withScreen.filter(a => a.date === today)
  const pool = todayItems.length > 0
    ? todayItems
    : (() => {
        const dates = [...new Set(withScreen.map(a => a.date))].sort().reverse()
        return withScreen.filter(a => a.date === dates[0])
      })()

  return pool.sort((a, b) => {
    const ao = a.order ?? 9999
    const bo = b.order ?? 9999
    if (ao !== bo) return ao - bo
    return (a.time || '').localeCompare(b.time || '')
  })
}

export function getMostRecentDate(list) {
  const today = new Date().toISOString().split('T')[0]
  const withScreen = list.filter(a => a.showOnScreen)
  const dates = [...new Set(withScreen.map(a => a.date))].sort().reverse()
  if (dates.includes(today)) return today
  return dates[0] || today
}

export function groupByDate(list) {
  const map = {}
  for (const a of list) {
    if (!map[a.date]) map[a.date] = []
    map[a.date].push(a)
  }
  return Object.entries(map)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, items]) => ({ date, items }))
}

export function formatDate(dateStr) {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${y}`
}

export function downloadDateFiles(announcements) {
  const byDate = {}
  for (const a of announcements) {
    if (!byDate[a.date]) byDate[a.date] = []
    byDate[a.date].push(a)
  }

  const dates = Object.keys(byDate).sort().reverse()

  triggerDownload(JSON.stringify(dates, null, 2), 'index.json')

  dates.forEach((date, i) => {
    setTimeout(() => {
      const data = { announcements: byDate[date] }
      triggerDownload(JSON.stringify(data, null, 2), `${date}.json`)
    }, (i + 1) * 300)
  })

  return dates.length + 1
}

function triggerDownload(content, filename) {
  const blob = new Blob([content], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
