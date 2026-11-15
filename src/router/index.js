import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    component: () => import('../AppLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', component: () => import('../views/Dashboard.vue') },
      { path: 'transactions', component: () => import('../views/Transactions.vue') },
      { path: 'budget', component: () => import('../views/Budget.vue') },
      { path: 'calculator', component: () => import('../views/Calculator.vue') },
      { path: 'settings', component: () => import('../views/Settings.vue') }
    ]
  },
  { path: '/login', component: () => import('../views/Login.vue') },
  { path: '/register', component: () => import('../views/Register.vue') }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.token) {
    next('/login')
  } else {
    next()
  }
})

export default router;
