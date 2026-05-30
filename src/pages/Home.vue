<template>
  <div class="page-wrapper">
    <div class="page-header">
      <div>
        <h1 class="page-title">Anúncios do Dia</h1>
        <p class="page-subtitle">{{ formatDate(displayDate) }}</p>
      </div>
    </div>

    <div v-if="loading" class="state-empty">
      <div class="spinner"></div>
    </div>

    <div v-else-if="error" class="state-empty">
      <p style="color: var(--danger)">Erro ao carregar anúncios.</p>
    </div>

    <template v-else>
      <div class="toolbar">
        <div class="filters" v-if="categories.length > 1">
          <button
            v-for="cat in ['todos', ...categories]"
            :key="cat"
            class="filter-btn"
            :class="{ active: activeFilter === cat }"
            @click="activeFilter = cat"
          >
            {{ cat }}
          </button>
        </div>

        <!-- Sábados anteriores -->
        <div class="prev-wrap" v-if="previousDates.length > 0">
          <button class="prev-btn" @click="showPrevious = !showPrevious">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Ver sábados anteriores
          </button>

          <Transition name="dropdown">
            <div v-if="showPrevious" class="prev-dropdown">
              <button
                v-for="d in previousDates"
                :key="d"
                class="prev-date-btn"
                @click="selectDate(d)"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <path d="M16 2v4M8 2v4M3 10h18"/>
                </svg>
                {{ formatDate(d) }}
              </button>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Banner quando visualizando data anterior -->
      <div v-if="isViewingPast" class="past-banner">
        <span>Exibindo sábado {{ formatDate(displayDate) }}</span>
        <button @click="goToLatest">← Voltar ao mais recente</button>
      </div>

      <div v-if="filtered.length === 0" class="state-empty">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3">
          <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
        </svg>
        <p>Nenhum anúncio para este sábado.</p>
      </div>

      <div v-else class="cards-grid">
        <AnnouncementCard
          v-for="a in filtered"
          :key="a.id"
          :announcement="a"
        />
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AnnouncementCard from '@/components/AnnouncementCard.vue'
import { fetchAnnouncements, getMostRecentAnnouncements, getMostRecentDate, formatDate } from '@/services/jsonService.js'

const allAnnouncements = ref([])
const announcements = ref([])
const displayDate = ref('')
const latestDate = ref('')
const loading = ref(true)
const error = ref(false)
const activeFilter = ref('todos')
const showPrevious = ref(false)

onMounted(async () => {
  try {
    const all = await fetchAnnouncements()
    allAnnouncements.value = all
    announcements.value = getMostRecentAnnouncements(all)
    const d = getMostRecentDate(all)
    displayDate.value = d
    latestDate.value = d
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
})

const categories = computed(() => [...new Set(announcements.value.map(a => a.category))])

const filtered = computed(() => {
  if (activeFilter.value === 'todos') return announcements.value
  return announcements.value.filter(a => a.category === activeFilter.value)
})

const allDates = computed(() =>
  [...new Set(allAnnouncements.value.map(a => a.date))].sort().reverse()
)

const previousDates = computed(() =>
  allDates.value.filter(d => d !== latestDate.value)
)

const isViewingPast = computed(() => displayDate.value !== latestDate.value)

function sortByOrder(list) {
  return [...list].sort((a, b) => {
    const ao = a.order ?? 9999, bo = b.order ?? 9999
    return ao !== bo ? ao - bo : (a.time || '').localeCompare(b.time || '')
  })
}

function selectDate(date) {
  displayDate.value = date
  const items = allAnnouncements.value.filter(a => a.date === date && a.showOnScreen)
  announcements.value = sortByOrder(items)
  activeFilter.value = 'todos'
  showPrevious.value = false
}

function goToLatest() {
  selectDate(latestDate.value)
}
</script>

<style scoped>
.toolbar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 28px;
  flex-wrap: wrap;
}

.filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 7px 16px;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 600;
  text-transform: capitalize;
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover { border-color: var(--border-2); color: var(--text); }
.filter-btn.active { background: var(--accent); color: #000; border-color: var(--accent); }

/* Sábados anteriores */
.prev-wrap {
  position: relative;
  flex-shrink: 0;
}

.prev-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 16px;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 600;
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.prev-btn:hover { border-color: var(--accent); color: var(--accent); }

.prev-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: var(--surface-2);
  border: 1px solid var(--border-2);
  border-radius: var(--radius);
  padding: 6px;
  min-width: 180px;
  z-index: 50;
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.prev-date-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 500;
  color: var(--text-muted);
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.15s;
  text-align: left;
}

.prev-date-btn:hover { background: var(--border); color: var(--text); }

/* Banner data anterior */
.past-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 20px;
  border-radius: var(--radius);
  background: rgba(212, 165, 32, 0.1);
  border: 1px solid rgba(212, 165, 32, 0.25);
  color: var(--accent);
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 24px;
}

.past-banner button {
  font-size: 13px;
  font-weight: 600;
  color: var(--accent);
  background: none;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.past-banner button:hover { opacity: 1; }

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
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

/* Dropdown animation */
.dropdown-enter-active, .dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.dropdown-enter-from, .dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@media (max-width: 640px) {
  .cards-grid { grid-template-columns: 1fr; }
  .toolbar { flex-direction: column; }
  .prev-wrap { align-self: flex-start; }
}
</style>
