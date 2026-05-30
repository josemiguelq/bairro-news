import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', component: () => import('@/pages/Home.vue') },
  { path: '/historico', component: () => import('@/pages/Historico.vue') },
  { path: '/telao', component: () => import('@/pages/Telao.vue') },
  { path: '/admin', component: () => import('@/pages/Admin.vue') }
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})
