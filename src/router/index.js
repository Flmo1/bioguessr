import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

import HomeView from '@/views/HomeView.vue'
import DailyView from '@/views/DailyView.vue'
import QuickView from '@/views/QuickView.vue'
import ModesView from '@/views/ModesView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import AdminView from '@/views/AdminView.vue'
import NotFoundView from '@/views/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/daily', name: 'daily', component: DailyView },
    { path: '/quick', name: 'quick', component: QuickView },
    { path: '/modes', name: 'modes', component: ModesView },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/register', name: 'register', component: RegisterView },
    { path: '/admin', name: 'admin', component: AdminView, meta: { requiresEditor: true } },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView },
  ],
})

// Only editors can open the admin page.
// The real security is the permissions in Appwrite.
router.beforeEach((to) => {
  const auth = useAuth()

  if (to.meta.requiresEditor && !auth.isEditor.value) {
    return { name: 'login' }
  }
})

export default router