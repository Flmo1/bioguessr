<script setup>
defineProps({
  hasPin: Boolean,
})

const emit = defineEmits(['guess', 'backToPhoto'])
</script>

<template>
  <!-- Only used on phones, while the map is open -->
  <div class="md:hidden absolute bottom-0 left-0 right-0 z-[1000] bg-sand p-4 flex gap-3">

    <button
      @click="emit('backToPhoto')"
      class="rounded-full py-4 px-5 font-bold bg-white"
    >
      Photo
    </button>

    <button
      @click="emit('guess')"
      :disabled="!hasPin"
      class="flex-1 rounded-full py-4 font-bold text-white text-lg"
      :class="hasPin ? 'bg-olive' : 'bg-bark opacity-50'"
    >
      {{ hasPin ? 'Guess' : 'Tap the map first' }}
    </button>

  </div>
</template>