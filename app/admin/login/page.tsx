import { loginAction } from '@/lib/actions'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '24px'
    }}>
      <div style={{
        width: '100%', maxWidth: '360px',
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '40px 32px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img src="/assets/logos/logo-bairro.png" alt="Logo"
            style={{ width: 64, height: 64, margin: '0 auto 16px', borderRadius: 12 }} />
          <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>Admin</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 6 }}>
            IASD Bairro Amambaí
          </p>
        </div>
        {error && (
          <div style={{ background:'rgba(239,68,68,.1)', border:'1px solid rgba(239,68,68,.3)', borderRadius:'var(--radius-sm)', padding:'10px 14px', fontSize:14, color:'#f87171', marginBottom:16 }}>
            Senha incorreta. Tente novamente.
          </div>
        )}

        <form action={loginAction} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="form-label">Senha</label>
            <input
              name="password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              required
              autoFocus
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
            Entrar
          </button>
        </form>
      </div>
    </div>
  )
}
