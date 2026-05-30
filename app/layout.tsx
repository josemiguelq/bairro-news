import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/Nav'

export const metadata: Metadata = {
  title: 'IASD Bairro Amambaí',
  description: 'Anúncios e programação da IASD Bairro Amambaí',
  openGraph: {
    title: 'IASD Bairro Amambaí',
    description: 'Anúncios e programação da semana',
    images: [{ url: '/og-cover.png', width: 1200, height: 630 }],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Nav />
        <main>{children}</main>
      </body>
    </html>
  )
}
