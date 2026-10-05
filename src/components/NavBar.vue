<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const auth = useAuth()
const router = useRouter()

// true = sound on, false = sound off
const soundOn = ref(true)

function toggleSound() {
  soundOn.value = !soundOn.value
}

async function handleLogout() {
  await auth.logout()
  router.push('/')
}
</script>

<template>
  <header class="bg-bark text-sand">
    <div class="max-w-[1200px] mx-auto px-6">
      <div class="flex items-center gap-10 py-5">

        <RouterLink to="/" class="font-display font-bold text-3xl uppercase mr-20">
          Bioguessr
        </RouterLink>

        <RouterLink to="/" class="text-lg uppercase">Home</RouterLink>
        <RouterLink to="/daily" class="text-lg uppercase">Daily</RouterLink>
        <RouterLink to="/modes" class="text-lg uppercase">Game modes</RouterLink>

        <!-- Not logged in -->
        <RouterLink v-if="!auth.user.value" to="/login" class="ml-auto text-lg uppercase">
          Log in
        </RouterLink>

        <!-- Logged in -->
        <div v-else class="ml-auto flex items-center gap-6">
          <span class="text-lg">{{ auth.user.value.name }}</span>
          <button @click="handleLogout" class="text-lg uppercase">Log out</button>
        </div>

      </div>
    </div>
  </header>
</template>