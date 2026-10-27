<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const auth = useAuth()
const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function handleRegister() {
  error.value = ''

  if (!name.value || !email.value || !password.value) {
    error.value = 'Please fill in all the fields.'
    return
  }

  if (password.value.length < 8) {
    error.value = 'The password must be at least 8 characters.'
    return
  }

  loading.value = true

  try {
    await auth.register(name.value, email.value, password.value)
    router.push('/')
  } catch (err) {
    console.log(err)
    if (err.code === 409) {
      error.value = 'That email already has an account. Try logging in.'
    } else {
      error.value = 'Could not create the account. Please try again.'
    }
  }

  loading.value = false
}
</script>

<template>
  <form @submit.prevent="handleRegister">

    <label for="name" class="block font-bold mb-2">Name</label>
    <input
      id="name"
      v-model="name"
      type="text"
      autocomplete="name"
      class="w-full bg-white rounded-xl px-4 py-3 mb-5"
    />

    <label for="email" class="block font-bold mb-2">Email</label>
    <input
      id="email"
      v-model="email"
      type="email"
      autocomplete="email"
      class="w-full bg-white rounded-xl px-4 py-3 mb-5"
    />

    <label for="password" class="block font-bold mb-2">Password</label>
    <input
      id="password"
      v-model="password"
      type="password"
      autocomplete="new-password"
      class="w-full bg-white rounded-xl px-4 py-3 mb-2"
    />
    <p class="text-sm mb-5">At least 8 characters.</p>

    <p v-if="error" class="text-red-700 mb-4">{{ error }}</p>

    <button
      type="submit"
      :disabled="loading"
      class="w-full bg-olive text-white font-bold rounded-full py-3"
    >
      {{ loading ? 'Creating account...' : 'Create account' }}
    </button>

  </form>
</template>