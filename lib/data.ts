import 'server-only'
import fs from 'fs'
import path from 'path'
import type { Announcement } from './types'

export type { Announcement }
export { formatDate } from './types'

const dataDir = path.join(process.cwd(), 'public', 'data')

export function getIndex(): string[] {
  try {
    return JSON.parse(fs.readFileSync(path.join(dataDir, 'index.json'), 'utf-8'))
  } catch { return [] }
}

export function getAnnouncementsByDate(date: string): Announcement[] {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(dataDir, `${date}.json`), 'utf-8'))
    return data.announcements || []
  } catch { return [] }
}

export function getMostRecentDate(): string {
  const index = getIndex()
  return index[0] ?? new Date().toISOString().split('T')[0]
}
