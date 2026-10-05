<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const auth = useAuth()
const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  error.value = ''

  if (!email.value || !password.value) {
    error.value = 'Please fill in both fields.'
    return
  }

  loading.value = true

  try {
    await auth.login(email.value, password.value)
    router.push('/')
  } catch {
    error.value = 'Wrong email or password.'
  }

  loading.value = false
}
</script>

<template>
  <form @submit.prevent="handleLogin">

    <label for="email" class="block font-bold mb-2">Email</label>
    <input
      id="email"
      v-model="email"
      type="email"
      class="w-full bg-white rounded-xl px-4 py-3 mb-5"
    />

    <label for="password" class="block font-bold mb-2">Password</label>
    <input
      id="password"
      v-model="password"
      type="password"
      class="w-full bg-white rounded-xl px-4 py-3 mb-5"
    />

    <p v-if="error" class="text-red-700 mb-4">{{ error }}</p>

    <button
      type="submit"
      :disabled="loading"
      class="w-full bg-olive text-white font-bold rounded-full py-3"
    >
      {{ loading ? 'Logging in...' : 'Log in' }}
    </button>

  </form>
</template>