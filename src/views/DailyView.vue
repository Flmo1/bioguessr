<script setup>
import { ref, onMounted } from 'vue'
import { getDailySubjects } from '@/services/subjectService'
import { getDistance, getPoints } from '@/utils/distance'
import GameMap from '@/components/GameMap.vue'
import ScoreBox from '@/components/ScoreBox.vue'
import RoundPanel from '@/components/RoundPanel.vue'
import RevealPanel from '@/components/RevealPanel.vue'
import ResultsPanel from '@/components/ResultsPanel.vue'

const subjects = ref([])
const loading = ref(true)
const error = ref('')

const currentRound = ref(0)
const stage = ref('guessing')

const guess = ref(null)
const score = ref(0)
const lastDistance = ref(0)
const lastPoints = ref(0)

const mapRef = ref(null)

onMounted(async () => {
  try {
    subjects.value = await getDailySubjects()
  } catch (err) {
    console.log(err)
    error.value = 'Could not load today’s expedition. Please try again.'
  }
  loading.value = false
})

function savePin(latlng) {
  guess.value = latlng
}

function makeGuess() {
  const subject = subjects.value[currentRound.value]
  const radius = Number(subject.radius) || 0

  lastDistance.value = getDistance(
    guess.value.lat,
    guess.value.lng,
    Number(subject.lat),
    Number(subject.lng)
  )

  lastPoints.value = getPoints(lastDistance.value, radius)
  score.value = score.value + lastPoints.value

  mapRef.value.showAnswer(Number(subject.lat), Number(subject.lng), radius)
  stage.value = 'reveal'
}

function nextRound() {
  mapRef.value.reset()
  guess.value = null

  if (currentRound.value === subjects.value.length - 1) {
    stage.value = 'results'
  } else {
    currentRound.value = currentRound.value + 1
    stage.value = 'guessing'
  }
}

function playAgain() {
  mapRef.value.reset()
  guess.value = null
  currentRound.value = 0
  score.value = 0
  stage.value = 'guessing'
}
</script>

<template>
  <div class="relative h-[calc(100vh-88px)] overflow-hidden">

    <p v-if="loading" class="p-10 text-xl">Loading today's expedition...</p>

    <p v-else-if="error" class="p-10 text-xl text-red-700">{{ error }}</p>

    <p v-else-if="subjects.length === 0" class="p-10 text-xl">
      No expedition today. Check back tomorrow!
    </p>

    <template v-else>
      <GameMap ref="mapRef" @pin="savePin" />

      <ScoreBox
        :score="score"
        :roundNumber="currentRound + 1"
        :totalRounds="subjects.length"
      />

      <RoundPanel
        v-if="stage === 'guessing'"
        :subject="subjects[currentRound]"
        :roundNumber="currentRound + 1"
        :totalRounds="subjects.length"
        :hasPin="guess !== null"
        @guess="makeGuess"
      />

      <RevealPanel
        v-else-if="stage === 'reveal'"
        :subject="subjects[currentRound]"
        :distance="lastDistance"
        :points="lastPoints"
        :isLastRound="currentRound === subjects.length - 1"
        @next="nextRound"
      />

      <ResultsPanel
        v-else
        :totalScore="score"
        :totalRounds="subjects.length"
        :isDaily="true"
        @playAgain="playAgain"
      />
    </template>

  </div>
</template>