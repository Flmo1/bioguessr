<script setup>
defineProps({
  score: Number,
})
</script>

<template>
  <div class="absolute top-6 right-6 z-[1000] bg-sand rounded-2xl px-5 py-3">
    <p class="text-sm text-bark">Current score</p>
    <p class="font-display font-bold text-2xl">{{ score }} pts</p>
  </div>
</template>