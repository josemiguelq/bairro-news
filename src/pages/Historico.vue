<template>
  <div class="page-wrapper">
    <div class="page-header">
      <h1 class="page-title">Histórico</h1>
      <p class="page-subtitle">Todos os anúncios cadastrados</p>
    </div>

    <div class="search-bar">
      <div class="search-input-wrap">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        <input v-model="search" class="form-input search-input" placeholder="Pesquisar anúncios..." />
      </div>
      <select v-model="monthFilter" class="form-input month-select">
        <option value="">Todos os meses</option>
        <option v-for="m in months" :key="m.value" :value="m.value">{{ m.label }}</option>
      </select>
    </div>

    <div v-if="loading" class="state-empty">
      <div class="spinner"></div>
    </div>

    <div v-else-if="grouped.length === 0" class="state-empty">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"/></svg>
      <p>Nenhum anúncio encontrado.</p>
    </div>

    <div v-else class="date-list">
      <div v-for="group in grouped" :key="group.date" class="date-group">
        <button class="date-row" @click="toggle(group.date)">
          <div class="date-info">
            <span class="date-label">{{ formatDate(group.date) }}</span>
            <span class="date-count">{{ group.items.length }} {{ group.items.length === 1 ? 'anúncio' : 'anúncios' }}</span>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            :style="{ transform: expanded.has(group.date) ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }">
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </button>
        <Transition name="slide-down">
          <div v-if="expanded.has(group.date)" class="date-cards">
            <AnnouncementCard
              v-for="a in group.items"
              :key="a.id"
              :announcement="a"
            />
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AnnouncementCard from '@/components/AnnouncementCard.vue'
import { fetchAnnouncements, groupByDate, formatDate } from '@/services/jsonService.js'

const all = ref([])
const loading = ref(true)
const search = ref('')
const monthFilter = ref('')
const expanded = ref(new Set())

onMounted(async () => {
  try { all.value = await fetchAnnouncements() }
  finally { loading.value = false }
})

const months = computed(() => {
  const set = new Set(all.value.map(a => a.date.slice(0, 7)))
  return [...set].sort((a, b) => b.localeCompare(a)).map(m => {
    const [y, mo] = m.split('-')
    const label = new Date(+y, +mo - 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    return { value: m, label: label.charAt(0).toUpperCase() + label.slice(1) }
  })
})

const filtered = computed(() => {
  let list = all.value
  if (monthFilter.value) list = list.filter(a => a.date.startsWith(monthFilter.value))
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter(a =>
      a.title?.toLowerCase().includes(q) ||
      a.subtitle?.toLowerCase().includes(q) ||
      a.category?.toLowerCase().includes(q) ||
      a.location?.toLowerCase().includes(q)
    )
  }
  return list
})

const grouped = computed(() => groupByDate(filtered.value))

function toggle(date) {
  if (expanded.value.has(date)) {
    expanded.value.delete(date)
  } else {
    expanded.value.add(date)
  }
  expanded.value = new Set(expanded.value)
}
</script>

<style scoped>
.search-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.search-input-wrap {
  position: relative;
  flex: 1;
  min-width: 200px;
}

.search-input-wrap svg {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  pointer-events: none;
}

.search-input { padding-left: 40px; }

.month-select { width: 200px; flex-shrink: 0; }

.date-list { display: flex; flex-direction: column; gap: 8px; }

.date-group {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
}

.date-row {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  cursor: pointer;
  background: none;
  border: none;
  color: var(--text);
  transition: background 0.2s;
  text-align: left;
}

.date-row:hover { background: var(--surface-2); }

.date-info { display: flex; align-items: center; gap: 16px; }

.date-label {
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.01em;
  font-variant-numeric: tabular-nums;
}

.date-count {
  font-size: 13px;
  color: var(--text-muted);
  background: var(--surface-2);
  padding: 2px 10px;
  border-radius: 100px;
  border: 1px solid var(--border);
}

.date-cards {
  padding: 0 20px 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  border-top: 1px solid var(--border);
  padding-top: 16px;
}

.slide-down-enter-active, .slide-down-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}
.slide-down-enter-from, .slide-down-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}
.slide-down-enter-to, .slide-down-leave-from {
  opacity: 1;
  max-height: 2000px;
}

.state-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 80px 0;
  color: var(--text-muted);
  font-size: 15px;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 2px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 640px) {
  .month-select { width: 100%; }
  .date-cards { grid-template-columns: 1fr; }
}
</style>
