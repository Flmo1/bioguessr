import AdminView from '@/views/AdminView.vue'
import { useAuth } from '@/composables/useAuth'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import DailyView from '@/views/DailyView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/daily', name: 'daily', component: DailyView },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/admin', name: 'admin', component: AdminView, meta: { requiresEditor: true } },
    { path: '/register', name: 'register', component: RegisterView },
  ],
})

router.beforeEach((to) => {
  const auth = useAuth()

  if (to.meta.requiresEditor && !auth.isEditor.value) {
    return { name: 'login' }
  }
})

export default router