'use client'

import { useEffect, useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade, Keyboard } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import 'swiper/css/effect-fade'
import VinhetaPlayer from '@/components/VinhetaPlayer'
import SlideAnnouncement from '@/components/SlideAnnouncement'
import { Announcement } from '@/lib/data'
import styles from './page.module.css'

export default function TelaoPage() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [showVinheta, setShowVinheta] = useState(true)
  const [slides, setSlides] = useState<Announcement[]>([])
  const [cursorHidden, setCursorHidden] = useState(false)
  const [idx, setIdx] = useState(0)
  const swiperRef = useRef<SwiperType | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    fetch('/data/index.json').then(r => r.json()).then(async (dates: string[]) => {
      const all: Announcement[] = []
      for (const date of dates) {
        const res = await fetch(`/data/${date}.json`)
        const data = await res.json()
        all.push(...(data.announcements as Announcement[]).filter(a => a.showOnScreen))
        if (all.length > 0) break // só o sábado mais recente
      }
      setSlides(all.sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999)))
    })

    rootRef.current?.requestFullscreen().catch(() => {})

    const onKey = (e: KeyboardEvent) => {
      if (!swiperRef.current) return
      if (e.key === 'ArrowRight' || e.key === ' ') swiperRef.current.slideNext()
      if (e.key === 'ArrowLeft') swiperRef.current.slidePrev()
    }
    document.addEventListener('keydown', onKey)

    const resetCursor = () => {
      setCursorHidden(false)
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setCursorHidden(true), 3000)
    }
    document.addEventListener('mousemove', resetCursor)

    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousemove', resetCursor)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return (
    <div ref={rootRef} className={`${styles.telao} ${cursorHidden ? styles.hideCursor : ''}`}>
      {showVinheta && <VinhetaPlayer onEnded={() => setShowVinheta(false)} />}

      {!showVinheta && slides.length === 0 && (
        <div className={styles.empty}>
          <img src="/assets/logos/logo-bairro.png" alt="" style={{ width:80, height:80, opacity:.3 }} />
          <p>Nenhum anúncio para hoje.</p>
        </div>
      )}

      {!showVinheta && slides.length > 0 && (
        <Swiper
          modules={[Autoplay, EffectFade, Keyboard]}
          effect="fade" fadeEffect={{ crossFade: true }}
          loop autoplay={{ delay: (slides[idx]?.duration || 10) * 1000, disableOnInteraction: false }}
          keyboard={{ enabled: true }}
          onSwiper={s => { swiperRef.current = s }}
          onSlideChange={s => setIdx(s.realIndex)}
          style={{ width:'100%', height:'100%' }}
        >
          {slides.map(s => (
            <SwiperSlide key={s.id}>
              <SlideAnnouncement announcement={s} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {!showVinheta && (
        <div className={styles.controls}>
          <span className={styles.counter}>{idx + 1} / {slides.length}</span>
        </div>
      )}
    </div>
  )
}
