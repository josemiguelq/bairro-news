'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface Props { onEnded: () => void }

export default function VinhetaPlayer({ onEnded }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLDivElement>(null)
  const tagRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const rafRef = useRef<number>(0)
  const rotRef = useRef(0)

  useEffect(() => {
    const c = canvasRef.current!
    let rot = 0

    function resize() {
      c.width = window.innerWidth
      c.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Build stars
    const s = starsRef.current!
    let html = ''
    for (let i = 0; i < 120; i++) {
      const x = Math.random()*100, y = Math.random()*100
      const sz = Math.random()*1.8+0.4, op = Math.random()*0.5+0.15
      const dl = Math.random()*4
      html += `<span style="position:absolute;left:${x}%;top:${y}%;width:${sz}px;height:${sz}px;opacity:${op};border-radius:50%;background:#fff;animation:twinkle 3s ${dl}s ease-in-out infinite alternate"></span>`
    }
    s.innerHTML = html

    function draw() {
      const ctx = c.getContext('2d')!
      const W = c.width, H = c.height, cx = W/2, cy = H/2
      const R = Math.min(W,H)*0.38
      ctx.clearRect(0,0,W,H)
      ctx.fillStyle='#030810'; ctx.fillRect(0,0,W,H)

      const halo = ctx.createRadialGradient(cx,cy,R*.75,cx,cy,R*1.45)
      halo.addColorStop(0,'rgba(30,80,180,.22)'); halo.addColorStop(.5,'rgba(20,50,130,.08)'); halo.addColorStop(1,'rgba(0,0,0,0)')
      ctx.beginPath(); ctx.arc(cx,cy,R*1.45,0,Math.PI*2); ctx.fillStyle=halo; ctx.fill()

      const ocean = ctx.createRadialGradient(cx-R*.28,cy-R*.28,R*.05,cx,cy,R)
      ocean.addColorStop(0,'#1a3a72'); ocean.addColorStop(.4,'#0e2248'); ocean.addColorStop(.8,'#061228'); ocean.addColorStop(1,'#020810')
      ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2); ctx.fillStyle=ocean; ctx.fill()

      ctx.save(); ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2); ctx.clip()
      for (let deg=-80;deg<=80;deg+=20) {
        const lat=deg*Math.PI/180, ly=cy+R*Math.sin(lat), rx=R*Math.cos(lat)
        if(rx<1) continue
        ctx.strokeStyle=`rgba(120,170,255,${deg===0?.55:.18})`;ctx.lineWidth=deg===0?1.1:.55
        ctx.beginPath();ctx.moveTo(cx-rx,ly);ctx.lineTo(cx+rx,ly);ctx.stroke()
      }
      for (let i=0;i<18;i++) {
        const theta=rot+i*(Math.PI*2/18), cosT=Math.cos(theta), rx=Math.abs(R*cosT)
        if(rx<.5) continue
        const d=(cosT+1)/2, m=i%3===0
        ctx.strokeStyle=`rgba(90,140,240,${m?0.08+d*.45:0.04+d*.22})`; ctx.lineWidth=m?.4+d*.7:.3+d*.3
        ctx.beginPath(); ctx.ellipse(cx,cy,rx,R,0,0,Math.PI*2); ctx.stroke()
      }
      ctx.restore()

      const spec=ctx.createRadialGradient(cx-R*.38,cy-R*.35,0,cx-R*.38,cy-R*.35,R*.7)
      spec.addColorStop(0,'rgba(255,255,255,.09)'); spec.addColorStop(1,'rgba(255,255,255,0)')
      ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2); ctx.fillStyle=spec; ctx.fill()

      const edge=ctx.createLinearGradient(cx-R,cy,cx+R,cy)
      edge.addColorStop(0,'rgba(212,165,32,.9)'); edge.addColorStop(.5,'rgba(150,110,20,.4)'); edge.addColorStop(1,'rgba(212,165,32,.9)')
      ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2); ctx.strokeStyle=edge; ctx.lineWidth=1.8; ctx.stroke()

      rot+=0.006
      rafRef.current = requestAnimationFrame(draw)
    }
    rafRef.current = requestAnimationFrame(draw)

    // Audio
    if (audioRef.current) {
      audioRef.current.src = '/assets/vinheta.mp3'
      audioRef.current.play().catch(() => {})
    }

    // GSAP
    gsap.set([logoRef.current, nameRef.current, tagRef.current], { opacity: 0, y: 40 })
    const tl = gsap.timeline({ onComplete: onEnded })
    tl.to(logoRef.current, { opacity:1, y:0, duration:1, delay:.6, ease:'power3.out' })
      .to(nameRef.current, { opacity:1, y:0, duration:.8, ease:'power3.out' }, '-=.4')
      .to(tagRef.current,  { opacity:.55, y:0, duration:.6, ease:'power2.out' }, '-=.35')
      .to({}, { duration: 3.5 })
      .to(containerRef.current, { opacity:0, duration:1, ease:'power2.inOut' })

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      tl.kill()
    }
  }, [onEnded])

  return (
    <div ref={containerRef} style={{ position:'fixed', inset:0, zIndex:20, overflow:'hidden' }}>
      <canvas ref={canvasRef} style={{ position:'absolute', inset:0, width:'100%', height:'100%' }} />
      <div ref={starsRef} style={{ position:'absolute', inset:0, pointerEvents:'none' }} />
      <style>{`@keyframes twinkle{from{opacity:inherit}to{opacity:.05}}`}</style>
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:20, pointerEvents:'none' }}>
        <div ref={logoRef} style={{ filter:'drop-shadow(0 0 24px rgba(212,165,32,.8))' }}>
          <img src="/assets/logos/logo-bairro.png" alt="Logo"
            style={{ width:'clamp(72px,10vw,120px)', height:'clamp(72px,10vw,120px)' }} />
        </div>
        <div ref={nameRef} style={{ fontFamily:'Inter,sans-serif', fontSize:'clamp(22px,3.5vw,52px)', fontWeight:800, color:'#fff', textAlign:'center', textShadow:'0 0 60px rgba(212,165,32,.5)' }}>
          Bairro Amambaí
        </div>
        <div ref={tagRef} style={{ fontFamily:'Inter,sans-serif', fontSize:'clamp(11px,1.4vw,18px)', fontWeight:500, letterSpacing:'.25em', textTransform:'uppercase', color:'rgba(160,180,255,.55)', textAlign:'center' }}>
          Sistema de Anúncios
        </div>
      </div>
      <audio ref={audioRef} preload="auto" />
    </div>
  )
}
