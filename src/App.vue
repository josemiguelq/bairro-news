<template>
  <div id="layout">
    <nav v-if="!isTelao" class="navbar">
      <div class="nav-inner">
        <RouterLink to="/" class="nav-brand">
          <img src="/assets/logos/logo-bairro.png" alt="Logo" class="nav-logo" />
          <span class="nav-name">Bairro Amambaí</span>
        </RouterLink>
        <div class="nav-links">
          <RouterLink to="/" class="nav-link">Anúncios</RouterLink>
          <RouterLink to="/historico" class="nav-link">Histórico</RouterLink>
          <RouterLink to="/admin" class="nav-link">Admin</RouterLink>
          <RouterLink to="/telao" class="nav-link nav-link-telao">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
            Telão
          </RouterLink>
        </div>
      </div>
    </nav>
    <main :class="{ 'no-nav': isTelao }">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isTelao = computed(() => route.path === '/telao')
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(10, 10, 15, 0.85);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
}

.nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}

.nav-logo {
  width: 36px;
  height: 36px;
  border-radius: 8px;
}

.nav-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -0.01em;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 500;
  color: var(--text-muted);
  transition: all 0.2s;
  text-decoration: none;
}

.nav-link:hover { color: var(--text); background: var(--surface); }
.nav-link.router-link-active { color: var(--text); background: var(--surface); }

.nav-link-telao {
  color: var(--accent);
  border: 1px solid rgba(212, 165, 32, 0.35);
  background: rgba(212, 165, 32, 0.1);
}
.nav-link-telao:hover { background: rgba(212, 165, 32, 0.2); color: #d4a520; }
.nav-link-telao.router-link-active { background: rgba(212, 165, 32, 0.2); color: #d4a520; }

main { min-height: calc(100vh - 64px); }
main.no-nav { min-height: 100vh; }

@media (max-width: 640px) {
  .nav-name { display: none; }
  .nav-link { padding: 8px 10px; font-size: 13px; }
}
</style>
