import { ref } from 'vue'
import * as authService from '@/services/authService'

// These are outside the function on purpose,
// so every component shares the same user.
const user = ref(null)
const checked = ref(false)

export function useAuth() {

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

  return { user, checked, loadUser, login, logout }
}