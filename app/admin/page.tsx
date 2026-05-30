import { getIndex, getAnnouncementsByDate } from '@/lib/data'
import { logoutAction } from '@/lib/actions'
import AdminClient from './AdminClient'

export default function AdminPage() {
  const dates = getIndex()
  const existingData = dates.map(date => ({
    date,
    announcements: getAnnouncementsByDate(date)
  }))

  return (
    <div className="page-wrapper">
      <div className="page-header" style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:16 }}>
        <div>
          <h1 className="page-title">Painel Admin</h1>
          <p className="page-subtitle">Gerencie os anúncios da igreja</p>
        </div>
        <form action={logoutAction}>
          <button type="submit" className="btn btn-ghost" style={{ marginTop:8 }}>Sair</button>
        </form>
      </div>
      <AdminClient existingData={existingData} />
    </div>
  )
}
