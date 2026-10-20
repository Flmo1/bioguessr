<script setup>
defineProps({
  subject: Object,
  roundNumber: Number,
  totalRounds: Number,
  hasPin: Boolean,
})

const emit = defineEmits(['guess'])
</script>

<template>
  <div class="absolute top-1/2 -translate-y-1/2 left-6 z-[1000] w-[300px] bg-sand rounded-3xl p-6">

    <p class="text-sm text-bark">Round {{ roundNumber }} of {{ totalRounds }}</p>

    <h1 class="font-display font-bold text-3xl mb-4">Guess the habitat</h1>

    <img
      :src="subject.photoUrl"
      :alt="'Photo of a ' + subject.name"
      class="w-full h-40 object-cover rounded-2xl mb-2"
    />

    <p class="text-xs text-bark mb-3">{{ subject.photoCredit }}</p>

    <div class="flex gap-2 mb-5">
      <span v-for="clue in subject.clues" :key="clue" class="bg-white text-sm px-3 py-1 rounded-full">
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