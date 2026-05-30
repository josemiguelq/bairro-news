<template>
  <button class="fs-btn" :title="isFs ? 'Sair do fullscreen' : 'Fullscreen'" @click="toggle">
    <svg v-if="!isFs" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/>
    </svg>
    <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3M16 21v-3a2 2 0 0 1 2-2h3"/>
    </svg>
  </button>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { requestFullscreen, exitFullscreen, isFullscreen } from '@/services/fullscreen.js'

const isFs = ref(false)

function toggle() {
  if (isFullscreen()) {
    exitFullscreen()
  } else {
    requestFullscreen()
  }
}

function onFsChange() {
  isFs.value = isFullscreen()
}

onMounted(() => document.addEventListener('fullscreenchange', onFsChange))
onUnmounted(() => document.removeEventListener('fullscreenchange', onFsChange))
</script>

<style scoped>
.fs-btn {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.12);
  color: rgba(255,255,255,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.fs-btn:hover {
  background: rgba(255,255,255,0.15);
  color: #fff;
}
</style>
