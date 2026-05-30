import { Announcement, formatDate } from '@/lib/types'

interface Props { announcement: Announcement }

export default function SlideAnnouncement({ announcement: a }: Props) {
  if (a.image) return (
    <div style={{ width:'100%', height:'100%', position:'relative', background:'#000', overflow:'hidden' }}>
      <div style={{ position:'absolute', inset:0, backgroundImage:`url(${a.image})`, backgroundSize:'contain', backgroundRepeat:'no-repeat', backgroundPosition:'center' }} />
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(0,0,0,.75) 0%,transparent 18%),linear-gradient(to bottom,rgba(0,0,0,.2) 0%,transparent 10%)' }} />
      <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'clamp(16px,2.5vw,32px) clamp(20px,3.5vw,48px)', display:'flex', alignItems:'center', justifyContent:'space-between', gap:16 }}>
        <div style={{ display:'flex', alignItems:'center', gap:'clamp(6px,1vw,12px)', flexWrap:'wrap' }}>
          {a.category && <span style={tagStyle}>{a.category}</span>}
          {a.time && <span style={tagStyle}>⏰ {a.time}</span>}
          {a.location && <span style={tagStyle}>📍 {a.location}</span>}
        </div>
        <img src="/assets/logos/logo-bairro.png" alt="" style={{ width:'clamp(28px,3vw,42px)', height:'clamp(28px,3vw,42px)', opacity:.45, flexShrink:0 }} />
      </div>
    </div>
  )

  return (
    <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse at 30% 40%, color-mix(in srgb, ${a.color||'#6366f1'} 30%, #050810) 0%, #050810 70%)`, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'clamp(12px,2vw,28px)', textAlign:'center', padding:'clamp(32px,5vw,80px)', maxWidth:'85%' }}>
        {a.category && <span style={tagStyle}>{a.category}</span>}
        <h1 style={{ fontSize:'clamp(40px,8vw,110px)', fontWeight:900, lineHeight:1, letterSpacing:'-.03em', color:'#fff' }}>{a.title}</h1>
        {a.subtitle && <p style={{ fontSize:'clamp(16px,2.2vw,30px)', color:'rgba(255,255,255,.55)' }}>{a.subtitle}</p>}
        <div style={{ display:'flex', gap:'clamp(16px,2.5vw,40px)', flexWrap:'wrap', justifyContent:'center' }}>
          {a.time && <span style={tagStyle}>⏰ {a.time}</span>}
          {a.location && <span style={tagStyle}>📍 {a.location}</span>}
        </div>
      </div>
      <img src="/assets/logos/logo-bairro.png" alt="" style={{ position:'absolute', top:'clamp(20px,3vw,40px)', right:'clamp(20px,3vw,40px)', width:'clamp(32px,4vw,52px)', height:'clamp(32px,4vw,52px)', opacity:.45 }} />
    </div>
  )
}

const tagStyle: React.CSSProperties = {
  display:'inline-flex', alignItems:'center', gap:5,
  padding:'clamp(4px,.6vw,7px) clamp(10px,1.2vw,16px)', borderRadius:100,
  fontSize:'clamp(11px,1.1vw,15px)', fontWeight:600,
  background:'rgba(0,0,0,.55)', backdropFilter:'blur(10px)',
  color:'rgba(255,255,255,.88)', border:'1px solid rgba(255,255,255,.15)', whiteSpace:'nowrap'
}
