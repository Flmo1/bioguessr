<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { saveGame, getTodayScores } from '@/services/gameService'
import ScoreChart from '@/components/ScoreChart.vue'

const props = defineProps({
  totalScore: Number,
  totalRounds: Number,
  isDaily: Boolean,
})

const emit = defineEmits(['playAgain'])

const auth = useAuth()

const scores = ref([])
const loading = ref(true)
const error = ref('')
const saved = ref(false)

// The best possible score: 5000 points per round
const maxScore = computed(() => props.totalRounds * 5000)

// How many players did worse than me, as a percentage
const beaten = computed(() => {
  if (scores.value.length < 2) return 0

  let worse = 0
  for (const game of scores.value) {
    if (game.score < props.totalScore) {
      worse = worse + 1
    }
  }
  return Math.round((worse / scores.value.length) * 100)
})

onMounted(async () => {
  // Only the daily expedition gets compared with other players
  if (!props.isDaily) {
    loading.value = false
    return
  }

  try {
    if (auth.user.value) {
      await saveGame(auth.user.value, props.totalScore)
      saved.value = true
    }
    scores.value = await getTodayScores()
  } catch (err) {
    console.log(err)
    error.value = 'Could not load how other players did.'
  }

  loading.value = false
})
</script>

<template>
  <div class="absolute top-6 bottom-6 left-6 z-[1000] w-[400px] bg-sand rounded-3xl p-7 flex flex-col overflow-y-auto">

    <h2 class="font-display font-bold text-4xl mb-2">Expedition complete!</h2>
    <p class="mb-5">You finished all {{ totalRounds }} rounds.</p>

    <div class="bg-white rounded-2xl p-5 mb-6 text-center">
      <p class="text-sm text-bark">Final score</p>
      <p class="font-display font-bold text-5xl text-olive">{{ totalScore }}</p>
      <p class="text-sm text-bark">out of {{ maxScore }}</p>
    </div>

    <div v-if="isDaily">

      <p v-if="loading" class="mb-6">Loading today's results...</p>

      <p v-else-if="error" class="text-red-700 mb-6">{{ error }}</p>

      <p v-else-if="scores.length === 0" class="mb-6">
        Nobody has played today yet. You are the first!
      </p>

      <div v-else class="mb-6">
        <h3 class="font-bold mb-1">How everyone did today</h3>
        <p class="text-sm text-bark mb-3">{{ scores.length }} players so far</p>

        <ScoreChart :scores="scores" :myScore="totalScore" :maxScore="maxScore" />

        <p class="font-bold mt-4">You did better than {{ beaten }}% of players today.</p>
      </div>

      <p v-if="!auth.user.value" class="bg-white rounded-xl p-4 mb-6 text-sm">
        <RouterLink to="/login" class="font-bold underline">Log in</RouterLink>
        to save your score and appear on the chart.
      </p>

    </div>

    <button
      @click="emit('playAgain')"
      class="mt-auto w-full rounded-full py-4 font-bold text-white text-lg bg-olive"
    >
      Play again
    </button>

  </div>
</template>