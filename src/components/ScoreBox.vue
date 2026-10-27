<script setup>
defineProps({
  score: Number,
  roundNumber: Number,
  totalRounds: Number,
})
</script>

<template>
  <div class="absolute top-6 right-6 z-[1000] flex gap-4">

    <div class="bg-sand rounded-2xl px-6 py-3 text-center">
      <p class="text-sm text-bark">Round</p>
      <p class="font-display font-bold text-2xl">{{ roundNumber }}/{{ totalRounds }}</p>
    </div>

    <div class="bg-sand rounded-2xl px-6 py-3 text-center">
      <p class="text-sm text-bark">Total score</p>
      <p class="font-display font-bold text-2xl">{{ score }}</p>
    </div>

  </div>
</template>