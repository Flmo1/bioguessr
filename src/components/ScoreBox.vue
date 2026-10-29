<script setup>
defineProps({
  score: Number,
  roundNumber: Number,
  totalRounds: Number,
})
</script>

<template>
  <div class="absolute top-3 right-3 md:top-6 md:right-6 z-[1000] flex gap-2 md:gap-4">

    <div class="bg-sand rounded-xl md:rounded-2xl px-3 py-2 md:px-6 md:py-3 text-center">
      <p class="text-xs md:text-sm text-bark">Round</p>
      <p class="font-display font-bold text-lg md:text-2xl">{{ roundNumber }}/{{ totalRounds }}</p>
    </div>

    <div class="bg-sand rounded-xl md:rounded-2xl px-3 py-2 md:px-6 md:py-3 text-center">
      <p class="text-xs md:text-sm text-bark">Score</p>
      <p class="font-display font-bold text-lg md:text-2xl">{{ score }}</p>
    </div>

  </div>
</template>