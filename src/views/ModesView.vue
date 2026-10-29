<script setup>
import ModeCard from '@/components/ModeCard.vue'
import ModeCardQuick from '@/components/ModeCardQuick.vue'
import ModeCardPvP from '@/components/ModeCardPvP.vue'
</script>

<template>
  <main class="max-w-[1200px] mx-auto px-4 md:px-6 py-10 md:py-16">

    <h1 class="font-display font-bold text-4xl md:text-5xl mb-4">Game modes</h1>
    <p class="text-lg max-w-2xl mb-8 md:mb-10">
      Choose how you want to explore: one puzzle a day, a quick round whenever you
      feel like it, or a match against another player.
    </p>

    <!-- One under the other on a phone, side by side on a big screen -->
    <div class="flex flex-col md:flex-row gap-6 md:gap-8">
      <ModeCard />
      <ModeCardQuick />
      <ModeCardPvP />
    </div>

  </main>
</template>