export interface Announcement {
  id: string
  template?: string
  title?: string
  subtitle?: string
  date: string
  time?: string
  location?: string
  category: string
  color?: string
  image?: string
  showOnScreen: boolean
  duration?: number
  order?: number
  createdAt?: string
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${y}`
}
