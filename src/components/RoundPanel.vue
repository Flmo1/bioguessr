<script setup>
defineProps({
  round: Object,
  hasPin: Boolean,
})

const emit = defineEmits(['guess'])
</script>

<template>
  <div class="absolute top-1/2 -translate-y-1/2 left-6 z-[1000] w-[300px] bg-sand rounded-3xl p-6">

    <p class="text-sm text-bark">Round {{ round.number }} of {{ round.total }}</p>

    <div class="flex items-start justify-between gap-3 mb-4">
      <h1 class="font-display font-bold text-3xl">Guess the habitat</h1>
      <span class="bg-white text-bark text-sm px-3 py-1 rounded-full">{{ round.difficulty }}</span>
    </div>

    <img :src="round.photo" :alt="round.photoAlt" class="w-full h-40 object-cover rounded-2xl mb-3" />

    <div class="flex gap-2 mb-5">
      <span v-for="clue in round.clues" :key="clue" class="bg-white text-sm px-3 py-1 rounded-full">
        {{ clue }}
      </span>
    </div>

    <p class="font-bold mb-4">Drop a pin where you think this species lives.</p>

    <button
      @click="emit('guess')"
      :disabled="!hasPin"
      class="w-full rounded-full py-3 font-bold text-white"
      :class="hasPin ? 'bg-olive' : 'bg-bark opacity-50'"
    >
      {{ hasPin ? 'Guess' : 'Place a pin first' }}
    </button>

  </div>
</template>