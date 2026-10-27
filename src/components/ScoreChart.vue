<script setup>
import { computed } from 'vue'

const props = defineProps({
  scores: Array,
  myScore: Number,
  maxScore: Number,
})

// How tall the tallest bar is allowed to be, in pixels
const chartHeight = 120

// Split the scores into 5 groups, so we can draw a bar for each group
const buckets = computed(() => {
  const size = props.maxScore / 5
  const list = []

  for (let i = 0; i < 5; i++) {
    const from = Math.round(size * i)
    const to = Math.round(size * (i + 1))

    // Count how many players landed in this group
    let count = 0
    for (const game of props.scores) {
      if (game.score >= from && game.score < to) {
        count = count + 1
      }
      // The very best scores belong in the last group
      if (i === 4 && game.score >= to) {
        count = count + 1
      }
    }

    // Is my own score in this group?
    let isMine = props.myScore >= from && props.myScore < to
    if (i === 4 && props.myScore >= to) {
      isMine = true
    }

    list.push({ from: from, to: to, count: count, isMine: isMine })
  }

  // Find the tallest bar so we can scale the others against it
  let biggest = 1
  for (const bucket of list) {
    if (bucket.count > biggest) {
      biggest = bucket.count
    }
  }

  // Work out the height of each bar in pixels
  for (const bucket of list) {
    bucket.height = Math.round((bucket.count / biggest) * chartHeight)
    // Empty groups still get a small line, so the chart looks complete
    if (bucket.height < 4) {
      bucket.height = 4
    }
  }

  return list
})
</script>

<template>
  <div>
    <!-- The bars. They grow from the bottom because of items-end -->
    <div class="flex items-end gap-2" :style="{ height: chartHeight + 20 + 'px' }">
      <div v-for="bucket in buckets" :key="bucket.from" class="flex-1 text-center">
        <p class="text-xs mb-1">{{ bucket.count }}</p>
        <div
          class="w-full rounded-t-lg"
          :class="bucket.isMine ? 'bg-olive' : 'bg-bark opacity-30'"
          :style="{ height: bucket.height + 'px' }"
        ></div>
      </div>
    </div>

    <!-- The numbers under the bars -->
    <div class="flex gap-2 border-t-2 border-bark pt-1">
      <p v-for="bucket in buckets" :key="bucket.from" class="flex-1 text-center text-xs text-bark">
        {{ Math.round(bucket.from / 1000) }}k
      </p>
    </div>

    <p class="text-sm mt-3 flex items-center gap-2">
      <span class="inline-block w-3 h-3 bg-olive rounded-sm"></span>
      The green bar is where you are.
    </p>
  </div>
</template>