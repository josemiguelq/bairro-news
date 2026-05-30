<template>
  <div ref="root" class="telao" :class="{ 'cursor-hidden': cursorHidden }">
    <VinhetaPlayer v-if="showVinheta" @ended="onVinhetaEnd" />

    <template v-if="!showVinheta">
      <div v-if="slides.length === 0" class="telao-empty">
        <img src="/assets/logos/logo-bairro.png" alt="Logo" class="empty-logo" />
        <p>Nenhum anúncio para exibir hoje.</p>
      </div>

      <swiper
        v-else
        :modules="swiperModules"
        :autoplay="autoplayConfig"
        :effect="'fade'"
        :fade-effect="{ crossFade: true }"
        :loop="true"
        :keyboard="{ enabled: true }"
        class="telao-swiper"
        @swiper="onSwiper"
      >
        <swiper-slide v-for="slide in slides" :key="slide.id">
          <SlideAnnouncement :announcement="slide" />
        </swiper-slide>
      </swiper>

      <div class="telao-controls">
        <FullscreenButton />
        <div class="slide-counter" v-if="slides.length > 1">
          {{ currentIndex + 1 }} / {{ slides.length }}
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, EffectFade, Keyboard } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-fade'

import VinhetaPlayer from '@/components/VinhetaPlayer.vue'
import SlideAnnouncement from '@/components/SlideAnnouncement.vue'
import FullscreenButton from '@/components/FullscreenButton.vue'
import { fetchAnnouncements, getMostRecentAnnouncements } from '@/services/jsonService.js'
import { requestFullscreen } from '@/services/fullscreen.js'

const root = ref(null)
const showVinheta = ref(true)
const slides = ref([])
const currentIndex = ref(0)
const cursorHidden = ref(false)
const swiperModules = [Autoplay, EffectFade, Keyboard]

let cursorTimer = null
let swiperInstance = null

onMounted(async () => {
  requestFullscreen(root.value).catch(() => {})
  const all = await fetchAnnouncements()
  slides.value = getMostRecentAnnouncements(all)
  document.addEventListener('keydown', onKey)
  document.addEventListener('mousemove', resetCursor)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKey)
  document.removeEventListener('mousemove', resetCursor)
  clearTimeout(cursorTimer)
})

const autoplayConfig = computed(() => ({
  delay: (slides.value[currentIndex.value]?.duration || 10) * 1000,
  disableOnInteraction: false,
  pauseOnMouseEnter: false
}))

function onVinhetaEnd() {
  showVinheta.value = false
}

function onSwiper(swiper) {
  swiperInstance = swiper
  swiper.on('slideChange', () => {
    currentIndex.value = swiper.realIndex
    if (swiperInstance) {
      const delay = (slides.value[swiper.realIndex]?.duration || 10) * 1000
      swiperInstance.params.autoplay.delay = delay
      swiperInstance.autoplay.start()
    }
  })
}

function onKey(e) {
  if (!swiperInstance) return
  if (e.key === 'ArrowRight' || e.key === ' ') swiperInstance.slideNext()
  if (e.key === 'ArrowLeft') swiperInstance.slidePrev()
}

function resetCursor() {
  cursorHidden.value = false
  clearTimeout(cursorTimer)
  cursorTimer = setTimeout(() => { cursorHidden.value = true }, 3000)
}
</script>

<style scoped>
.telao {
  position: fixed;
  inset: 0;
  background: #000;
  overflow: hidden;
}

.telao.cursor-hidden { cursor: none; }

.telao-swiper {
  width: 100%;
  height: 100%;
}

.telao-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 24px;
  color: rgba(255,255,255,0.4);
  font-size: 20px;
  font-family: 'Inter', sans-serif;
}

.empty-logo { width: 80px; height: 80px; opacity: 0.3; }

.telao-controls {
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 50;
  opacity: 0;
  transition: opacity 0.3s;
}

.telao:not(.cursor-hidden) .telao-controls { opacity: 1; }

.slide-counter {
  font-size: 13px;
  font-weight: 600;
  color: rgba(255,255,255,0.5);
  background: rgba(0,0,0,0.5);
  padding: 6px 12px;
  border-radius: 100px;
  font-variant-numeric: tabular-nums;
}
</style>
