<script setup>
defineProps({
  subject: Object,
  distance: Number,
  points: Number,
  isLastRound: Boolean,
})

const emit = defineEmits(['next'])
</script>

<template>
  <div class="absolute top-1/2 -translate-y-1/2 left-6 z-[1000] w-[300px] bg-sand rounded-3xl p-6">

    <p class="text-sm text-bark">It was a</p>
    <h2 class="font-display font-bold text-3xl mb-1">{{ subject.name }}</h2>
    <p class="italic text-bark mb-4">{{ subject.scientificName }}</p>

    <p class="mb-4">{{ subject.funFact }}</p>

    <div class="bg-white rounded-2xl p-4 mb-5">
      <p class="text-sm text-bark">You were</p>
      <p class="font-display font-bold text-2xl mb-2">{{ distance }} km away</p>
      <p class="font-display font-bold text-2xl text-olive">+{{ points }} points</p>
    </div>

    <button
      @click="emit('next')"
      class="w-full rounded-full py-3 font-bold text-white bg-olive"
    >
      {{ isLastRound ? 'See results' : 'Next round' }}
    </button>

  </div>
</template>