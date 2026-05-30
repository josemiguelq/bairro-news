<template>
  <div ref="wrapper" class="preview-wrapper">
    <div ref="scaler" class="preview-scaler">
      <component :is="templateComponent" :announcement="announcement" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import TemplateModern from '@/templates/TemplateModern.vue'
import TemplateClassic from '@/templates/TemplateClassic.vue'
import TemplateMinimal from '@/templates/TemplateMinimal.vue'
import { exportToPNG } from '@/services/imageGenerator.js'

const props = defineProps({
  announcement: { type: Object, required: true }
})

const wrapper = ref(null)
const scaler = ref(null)

const templateComponent = computed(() => {
  const map = { modern: TemplateModern, classic: TemplateClassic, minimal: TemplateMinimal }
  return map[props.announcement.template] || TemplateModern
})

function updateScale() {
  if (!wrapper.value || !scaler.value) return
  const scale = wrapper.value.offsetWidth / 1280
  scaler.value.style.transform = `scale(${scale})`
  wrapper.value.style.height = `${720 * scale}px`
}

let ro = null

onMounted(() => {
  updateScale()
  ro = new ResizeObserver(updateScale)
  ro.observe(wrapper.value)
})

onUnmounted(() => ro?.disconnect())

async function exportPNG() {
  if (!scaler.value) return
  const el = scaler.value.firstElementChild
  const filename = `${props.announcement.title || 'anuncio'}-${Date.now()}.png`
  await exportToPNG(el || scaler.value, filename)
}

defineExpose({ exportPNG })
</script>

<style scoped>
.preview-wrapper {
  width: 100%;
  background: #000;
  border-radius: var(--radius);
  overflow: hidden;
  border: 1px solid var(--border);
  position: relative;
}

.preview-scaler {
  width: 1280px;
  height: 720px;
  transform-origin: top left;
}
</style>
