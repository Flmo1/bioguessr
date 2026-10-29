<script setup>
import NavBar from '@/components/NavBar.vue'
</script>

<template>

  <div class="flex flex-col h-dvh">
    <NavBar />
    <main class="flex-1 overflow-y-auto">
      <RouterView />
    </main>
  </div>
</template>