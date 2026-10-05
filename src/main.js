import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useAuth } from '@/composables/useAuth'



import App from './App.vue'
import router from './router'
import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

const auth = useAuth()
auth.loadUser().then(() => {
  app.mount('#app')
})
