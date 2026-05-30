'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Nav.module.css'

export default function Nav() {
  const pathname = usePathname()
  if (pathname === '/telao') return null

  return (
    <nav className={styles.navbar}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand}>
          <img src="/assets/logos/logo-bairro.png" alt="Logo" className={styles.logo} />
          <span className={styles.name}>Bairro Amambaí</span>
        </Link>
        <div className={styles.links}>
          <Link href="/" className={`${styles.link} ${pathname === '/' ? styles.active : ''}`}>Anúncios</Link>
          <Link href="/historico" className={`${styles.link} ${pathname === '/historico' ? styles.active : ''}`}>Histórico</Link>
          <Link href="/admin" className={`${styles.link} ${pathname.startsWith('/admin') ? styles.active : ''}`}>Admin</Link>
          <Link href="/telao" className={`${styles.link} ${styles.telao}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2"/>
              <path d="M8 21h8M12 17v4"/>
            </svg>
            Telão
          </Link>
        </div>
      </div>
    </nav>
  )
}
