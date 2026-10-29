<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const auth = useAuth()
const router = useRouter()

// On a phone the links are hidden until you press the menu button
const menuOpen = ref(false)

function closeMenu() {
  menuOpen.value = false
}

async function handleLogout() {
  await auth.logout()
  closeMenu()
  router.push('/')
}
</script>

<template>
  <header class="bg-bark text-sand shrink-0">
    <div class="max-w-[1200px] mx-auto px-4 md:px-6">

      <div class="flex items-center gap-6 md:gap-10 py-4 md:py-5">

        <RouterLink to="/" @click="closeMenu" class="font-display font-bold text-2xl md:text-3xl uppercase md:mr-20">
          Bioguessr
        </RouterLink>

        <!-- Links for big screens -->
        <nav class="hidden md:flex items-center gap-10">
          <RouterLink to="/" class="text-lg uppercase">Home</RouterLink>
          <RouterLink to="/daily" class="text-lg uppercase">Daily</RouterLink>
          <RouterLink to="/modes" class="text-lg uppercase">Game modes</RouterLink>
        </nav>

        <div class="hidden md:flex items-center gap-6 ml-auto">
          <RouterLink v-if="!auth.user.value" to="/login" class="text-lg uppercase">Log in</RouterLink>
          <template v-else>
            <RouterLink v-if="auth.isEditor.value" to="/admin" class="text-lg uppercase">Admin</RouterLink>
            <span class="text-lg">{{ auth.user.value.name }}</span>
            <button @click="handleLogout" class="text-lg uppercase">Log out</button>
          </template>
        </div>

        <!-- Menu button, only on phones -->
        <button
          @click="menuOpen = !menuOpen"
          class="md:hidden ml-auto w-10 h-10 flex items-center justify-center text-2xl"
          :aria-expanded="menuOpen"
          aria-label="Menu"
        >
          {{ menuOpen ? '✕' : '☰' }}
        </button>

      </div>

      <!-- The open menu on phones -->
      <nav v-if="menuOpen" class="md:hidden flex flex-col gap-1 pb-4">
        <RouterLink to="/" @click="closeMenu" class="text-lg uppercase py-2">Home</RouterLink>
        <RouterLink to="/daily" @click="closeMenu" class="text-lg uppercase py-2">Daily</RouterLink>
        <RouterLink to="/modes" @click="closeMenu" class="text-lg uppercase py-2">Game modes</RouterLink>

        <RouterLink v-if="!auth.user.value" to="/login" @click="closeMenu" class="text-lg uppercase py-2">
          Log in
        </RouterLink>

        <template v-else>
          <RouterLink v-if="auth.isEditor.value" to="/admin" @click="closeMenu" class="text-lg uppercase py-2">
            Admin
          </RouterLink>
          <span class="py-2 opacity-70">Logged in as {{ auth.user.value.name }}</span>
          <button @click="handleLogout" class="text-lg uppercase py-2 text-left">Log out</button>
        </template>
      </nav>

    </div>
  </header>
</template>