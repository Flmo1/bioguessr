import { ref, computed } from 'vue'
import * as authService from '@/services/authService'

// Outside the function, so every component shares the same user
const user = ref(null)
const checked = ref(false)

export function useAuth() {

  // True if this user has the "editor" label in Appwrite
  const isEditor = computed(() => {
    if (!user.value) return false
    if (!user.value.labels) return false
    return user.value.labels.includes('editor')
  })

  async function loadUser() {
    user.value = await authService.getUser()
    checked.value = true
  }

  async function login(email, password) {
    await authService.login(email, password)
    user.value = await authService.getUser()
  }

  async function logout() {
    await authService.logout()
    user.value = null
  }

  return { user, checked, isEditor, loadUser, login, logout }
}