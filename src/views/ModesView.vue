<script setup>
import ModeCard from '@/components/ModeCard.vue'
import ModeCardQuick from '@/components/ModeCardQuick.vue'
import ModeCardPvP from '@/components/ModeCardPvP.vue'
</script>

<template>
  <main class="max-w-[1200px] mx-auto px-6 py-16">

    <h1 class="font-display font-bold text-5xl mb-4">Game modes</h1>
    <p class="text-lg max-w-2xl mb-10">
      Choose how you want to explore: one puzzle a day, a quick round whenever you
      feel like it, or a match against another player.
    </p>

    <div class="flex gap-8">
      <ModeCard />
      <ModeCardQuick />
      <ModeCardPvP />
    </div>

  </main>
</template>