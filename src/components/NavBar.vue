<script setup>
import { ref } from 'vue'

// true = sound on, false = sound off
const soundOn = ref(true)

function toggleSound() {
  soundOn.value = !soundOn.value
}
</script>

<template>
  <header class="bg-bark text-sand">
    <div class="max-w-[1200px] mx-auto px-6">
      <div class="flex items-center py-5">

        <RouterLink to="/" class="font-display font-bold text-3xl uppercase mr-20">
          Bioguessr
        </RouterLink>

      <RouterLink to="/" class="text-lg uppercase mr-10">Home</RouterLink>
      <RouterLink to="/daily" class="text-lg uppercase mr-10">Daily</RouterLink>
      <RouterLink to="/modes" class="text-lg uppercase mr-10">Game modes</RouterLink>

      <RouterLink to="/login" class="ml-auto text-lg uppercase">Log in</RouterLink>

     </div>
    </div>
  </header>
</template>