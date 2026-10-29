<script setup>
import { ref, onMounted } from 'vue'
import { getDailySubjects } from '@/services/subjectService'
import { getDistance, getPoints } from '@/utils/distance'
import GameMap from '@/components/GameMap.vue'
import ScoreBox from '@/components/ScoreBox.vue'
import RoundPanel from '@/components/RoundPanel.vue'
import RevealPanel from '@/components/RevealPanel.vue'
import ResultsPanel from '@/components/ResultsPanel.vue'
import MapBar from '@/components/MapBar.vue'

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

// Only used on phones. True means the panel is hidden so you can see the map.
const mapOpen = ref(false)

onMounted(async () => {
  try {
    subjects.value = await getDailySubjects()
  } catch (err) {
    console.log(err)
    error.value = 'Could not load today’s expedition. Please try again.'
  }
  loading.value = false
})

function openMap() {
  mapOpen.value = true
}

function backToPhoto() {
  mapOpen.value = false
}

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

  // On a phone we keep the map visible so the player sees the answer
  stage.value = 'reveal'
  mapOpen.value = true
}

function nextRound() {
  mapRef.value.reset()
  guess.value = null
  mapOpen.value = false

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
  mapOpen.value = false
  currentRound.value = 0
  score.value = 0
  stage.value = 'guessing'
}
</script>

<template>
  <div class="relative h-full overflow-hidden">

    <p v-if="loading" class="p-6 md:p-10 text-xl">Loading today's expedition...</p>

    <p v-else-if="error" class="p-6 md:p-10 text-xl text-red-700">{{ error }}</p>

    <p v-else-if="subjects.length === 0" class="p-6 md:p-10 text-xl">
      No expedition today. Check back tomorrow!
    </p>

    <template v-else>
      <GameMap ref="mapRef" @pin="savePin" />

      <ScoreBox
        :score="score"
        :roundNumber="currentRound + 1"
        :totalRounds="subjects.length"
      />

      <!-- While the map is open on a phone, the panel is hidden.
           On a big screen the panel is always there. -->
      <RoundPanel
        v-if="stage === 'guessing'"
        :class="mapOpen ? 'hidden md:flex' : 'flex'"
        :subject="subjects[currentRound]"
        :roundNumber="currentRound + 1"
        :totalRounds="subjects.length"
        :hasPin="guess !== null"
        @guess="makeGuess"
        @openMap="openMap"
      />

      <RevealPanel
        v-else-if="stage === 'reveal'"
        :class="mapOpen ? 'hidden md:flex' : 'flex'"
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

      <!-- The bar at the bottom of a phone while the map is open -->
      <MapBar
        v-if="mapOpen && stage === 'guessing'"
        :hasPin="guess !== null"
        @guess="makeGuess"
        @backToPhoto="backToPhoto"
      />

      <!-- After guessing, a phone needs a way back to the result card -->
      <button
        v-if="mapOpen && stage === 'reveal'"
        @click="backToPhoto"
        class="md:hidden absolute bottom-4 left-4 right-4 z-[1000] rounded-full py-4 font-bold text-white text-lg bg-olive"
      >
        See the result
      </button>

    </template>

  </div>
</template>