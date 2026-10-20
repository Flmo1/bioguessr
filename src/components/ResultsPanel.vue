<script setup>
defineProps({
  totalScore: Number,
  totalRounds: Number,
})

const emit = defineEmits(['playAgain'])
</script>

<template>
  <div class="absolute top-1/2 -translate-y-1/2 left-6 z-[1000] w-[300px] bg-sand rounded-3xl p-6 text-center">

    <h2 class="font-display font-bold text-3xl mb-2">Expedition complete!</h2>
    <p class="mb-5">You finished all {{ totalRounds }} rounds.</p>

    <div class="bg-white rounded-2xl p-5 mb-5">
      <p class="text-sm text-bark">Final score</p>
      <p class="font-display font-bold text-4xl text-olive">{{ totalScore }}</p>
    </div>

    <button
      @click="emit('playAgain')"
      class="w-full rounded-full py-3 font-bold text-white bg-olive"
    >
      Play again
    </button>

  </div>
</template>