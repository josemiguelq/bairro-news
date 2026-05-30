<template>
  <div class="page-wrapper">
    <div class="page-header admin-header">
      <div>
        <h1 class="page-title">Painel Admin</h1>
        <p class="page-subtitle">Gerencie os anúncios da igreja</p>
      </div>
      <div class="header-actions">
        <span v-if="exportMsg" class="export-msg">{{ exportMsg }}</span>
        <button class="btn btn-ghost" @click="doExport">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
          Exportar JSON
        </button>
        <button class="btn btn-primary" @click="openNew">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Novo Anúncio
        </button>
      </div>
    </div>

    <div v-if="loading" class="state-empty">
      <div class="spinner"></div>
    </div>

    <div v-else class="admin-layout" :class="{ 'panel-open': !!editing }">
      <!-- LIST -->
      <div class="announcements-list">
        <div v-if="announcements.length === 0" class="state-empty small">
          <p>Nenhum anúncio cadastrado.</p>
        </div>
        <div v-for="a in announcements" :key="a.id" class="ann-row" :class="{ selected: editing?.id === a.id }">
          <div class="ann-color" :style="{ background: a.color || 'var(--accent)' }"></div>
          <div class="ann-info">
            <div class="ann-title">{{ a.title }}</div>
            <div class="ann-meta">
              <span class="badge badge-order" v-if="a.order != null">#{{ a.order }}</span>
              <span class="badge">{{ a.template }}</span>
              <span class="badge">{{ a.category }}</span>
              <span class="badge" :class="a.showOnScreen ? 'badge-accent' : ''">{{ a.date }}</span>
            </div>
          </div>
          <div class="ann-actions">
            <button class="icon-btn" title="Editar" @click="openEdit(a)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="icon-btn" title="Duplicar" @click="duplicate(a)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            </button>
            <button class="icon-btn danger" title="Deletar" @click="remove(a.id)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- EDIT PANEL -->
      <div v-if="editing" class="edit-panel">
        <div class="panel-header">
          <h2 class="panel-title">{{ isNew ? 'Novo Anúncio' : 'Editar Anúncio' }}</h2>
          <button class="icon-btn" @click="closeEdit">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="panel-body">
          <!-- Preview -->
          <div class="preview-section">
            <TemplatePreview ref="previewRef" :announcement="editing" />
            <button class="btn btn-ghost btn-sm export-btn" @click="exportPNG">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
              Exportar PNG
            </button>
          </div>

          <!-- Form -->
          <div class="form-grid">
            <div class="form-group" style="grid-column: 1/-1">
              <label class="form-label">Título *</label>
              <input v-model="editing.title" class="form-input" placeholder="Ex: Culto Jovem" />
            </div>

            <div class="form-group" style="grid-column: 1/-1">
              <label class="form-label">Subtítulo</label>
              <input v-model="editing.subtitle" class="form-input" placeholder="Ex: Uma noite especial" />
            </div>

            <div class="form-group">
              <label class="form-label">Data</label>
              <input v-model="editing.date" type="date" class="form-input" />
            </div>

            <div class="form-group">
              <label class="form-label">Horário</label>
              <input v-model="editing.time" type="time" class="form-input" />
            </div>

            <div class="form-group" style="grid-column: 1/-1">
              <label class="form-label">Local</label>
              <input v-model="editing.location" class="form-input" placeholder="Ex: IASD Bairro Amambaí" />
            </div>

            <div class="form-group">
              <label class="form-label">Categoria</label>
              <input v-model="editing.category" class="form-input" placeholder="Ex: jovens" list="categories-datalist" />
              <datalist id="categories-datalist">
                <option v-for="c in existingCategories" :key="c" :value="c" />
              </datalist>
            </div>

            <div class="form-group">
              <label class="form-label">Ordem de exibição</label>
              <input v-model.number="editing.order" type="number" min="1" step="1" class="form-input" placeholder="1, 2, 3…" />
            </div>

            <div class="form-group">
              <label class="form-label">Template</label>
              <select v-model="editing.template" class="form-input">
                <option value="modern">Modern</option>
                <option value="classic">Classic</option>
                <option value="minimal">Minimal</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Cor Principal</label>
              <div class="color-row">
                <input v-model="editing.color" type="color" class="color-picker" />
                <input v-model="editing.color" class="form-input" placeholder="#d4a520" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Duração no Telão (segundos)</label>
              <div class="duration-row">
                <input v-model.number="editing.duration" type="range" min="5" max="60" step="5" class="range-input" />
                <span class="duration-label">{{ editing.duration }}s</span>
              </div>
            </div>

            <div class="form-group" style="grid-column: 1/-1">
              <label class="form-label">URL da Imagem</label>
              <input v-model="editing.image" class="form-input" placeholder="https://i.imgur.com/..." />
            </div>

            <div class="form-group" style="grid-column: 1/-1">
              <label class="form-label" style="display:flex;align-items:center;gap:12px;justify-content:space-between">
                Exibir no Telão
                <label class="toggle">
                  <input v-model="editing.showOnScreen" type="checkbox" />
                  <span class="toggle-slider"></span>
                </label>
              </label>
            </div>
          </div>
        </div>

        <div class="panel-footer">
          <button class="btn btn-ghost" @click="closeEdit">Cancelar</button>
          <button class="btn btn-primary" @click="save">Salvar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import TemplatePreview from '@/components/TemplatePreview.vue'
import { fetchAnnouncements, downloadDateFiles } from '@/services/jsonService.js'

const announcements = ref([])
const loading = ref(true)
const editing = ref(null)
const isNew = ref(false)
const previewRef = ref(null)
const exportMsg = ref('')

onMounted(async () => {
  try { announcements.value = await fetchAnnouncements() }
  finally { loading.value = false }
})

const existingCategories = computed(() => [...new Set(announcements.value.map(a => a.category).filter(Boolean))])

function blankAnnouncement() {
  return {
    id: crypto.randomUUID(),
    template: 'modern',
    title: '',
    subtitle: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    location: 'IASD Bairro Amambaí',
    category: '',
    color: '#d4a520',
    image: '',
    showOnScreen: true,
    duration: 10,
    order: announcements.value.length + 1,
    createdAt: new Date().toISOString()
  }
}

function openNew() {
  isNew.value = true
  editing.value = blankAnnouncement()
}

function openEdit(a) {
  isNew.value = false
  editing.value = { ...a }
}

function closeEdit() {
  editing.value = null
}

function save() {
  if (!editing.value.title.trim()) return
  if (isNew.value) {
    announcements.value.push(editing.value)
  } else {
    const idx = announcements.value.findIndex(a => a.id === editing.value.id)
    if (idx !== -1) announcements.value[idx] = editing.value
  }
  closeEdit()
}

function duplicate(a) {
  const copy = { ...a, id: crypto.randomUUID(), createdAt: new Date().toISOString(), title: a.title + ' (cópia)' }
  announcements.value.push(copy)
}

function remove(id) {
  if (!confirm('Deletar este anúncio?')) return
  announcements.value = announcements.value.filter(a => a.id !== id)
}

function doExport() {
  const n = downloadDateFiles(announcements.value)
  exportMsg.value = `${n} arquivo(s) baixado(s) — coloque em public/data/ e faça commit no GitHub`
  setTimeout(() => { exportMsg.value = '' }, 6000)
}

async function exportPNG() {
  await previewRef.value?.exportPNG()
}
</script>

<style scoped>
.admin-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.header-actions { display: flex; align-items: center; gap: 10px; flex-shrink: 0; flex-wrap: wrap; justify-content: flex-end; }

.badge-order {
  background: rgba(212, 165, 32, 0.15);
  color: #d4a520;
  border-color: rgba(212, 165, 32, 0.35);
  font-variant-numeric: tabular-nums;
}

.export-msg {
  font-size: 12px;
  color: var(--success);
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.25);
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  max-width: 320px;
}

.admin-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  transition: grid-template-columns 0.3s;
}

.admin-layout.panel-open {
  grid-template-columns: 1fr 480px;
}

.announcements-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ann-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  transition: border-color 0.2s;
}

.ann-row:hover { border-color: var(--border-2); }
.ann-row.selected { border-color: var(--accent); background: rgba(99,102,241,0.06); }

.ann-color {
  width: 4px;
  height: 40px;
  border-radius: 2px;
  flex-shrink: 0;
}

.ann-info { flex: 1; min-width: 0; }

.ann-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ann-meta { display: flex; gap: 6px; flex-wrap: wrap; }

.ann-actions { display: flex; gap: 4px; flex-shrink: 0; }

.icon-btn {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.icon-btn:hover { background: var(--surface-2); color: var(--text); border-color: var(--border-2); }
.icon-btn.danger:hover { background: rgba(239,68,68,0.1); color: var(--danger); border-color: rgba(239,68,68,0.3); }

/* Edit Panel */
.edit-panel {
  position: sticky;
  top: 80px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 100px);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
}

.panel-title {
  font-size: 16px;
  font-weight: 700;
}

.panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.preview-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.export-btn { align-self: flex-end; }

.btn-sm { padding: 6px 14px; font-size: 12px; }

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.color-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.color-picker {
  width: 42px;
  height: 42px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 2px;
  background: var(--surface);
  cursor: pointer;
  flex-shrink: 0;
}

.duration-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.range-input {
  flex: 1;
  accent-color: var(--accent);
  height: 4px;
}

.duration-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--accent);
  min-width: 32px;
}

.panel-footer {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding: 16px 24px;
  border-top: 1px solid var(--border);
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

.state-empty.small { padding: 40px 0; }

.spinner {
  width: 32px;
  height: 32px;
  border: 2px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 900px) {
  .admin-layout.panel-open {
    grid-template-columns: 1fr;
  }
  .edit-panel {
    position: fixed;
    inset: 0;
    top: 64px;
    z-index: 50;
    border-radius: 0;
    max-height: calc(100vh - 64px);
  }
}

@media (max-width: 640px) {
  .form-grid { grid-template-columns: 1fr; }
  .form-group[style*="grid-column"] { grid-column: auto !important; }
}
</style>
