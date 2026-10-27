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
  <div class="absolute top-6 bottom-6 left-6 z-[1000] w-[400px] bg-sand rounded-3xl p-7 flex flex-col overflow-y-auto">

    <p class="text-sm text-bark">It was a</p>
    <h2 class="font-display font-bold text-4xl mb-1">{{ subject.name }}</h2>
    <p class="italic text-bark mb-5">{{ subject.scientificName }}</p>

    <img
      :src="subject.photoUrl"
      :alt="'Photo of a ' + subject.name"
      class="w-full h-56 object-cover rounded-2xl mb-3"
    />

    <p class="text-xs text-bark mb-5">{{ subject.photoCredit }}</p>

    <p class="mb-6">{{ subject.funFact }}</p>

    <div class="bg-white rounded-2xl p-5 mb-6">
      <p class="text-sm text-bark">You were</p>
      <p class="font-display font-bold text-3xl mb-3">{{ distance }} km away</p>
      <p class="font-display font-bold text-3xl text-olive">+{{ points }} points</p>
    </div>

    <button
      @click="emit('next')"
      class="mt-auto w-full rounded-full py-4 font-bold text-white text-lg bg-olive"
    >
      {{ isLastRound ? 'See results' : 'Next round' }}
    </button>

  </div>
</template>