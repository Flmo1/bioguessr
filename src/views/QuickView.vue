<script setup>
import { ref, onMounted } from 'vue'
import { getRandomSubjects } from '@/services/subjectService'
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

onMounted(() => {
  loadRounds()
})

async function loadRounds() {
  loading.value = true
  error.value = ''
  try {
    subjects.value = await getRandomSubjects()
  } catch (err) {
    console.log(err)
    error.value = 'Could not start a quick play. Please try again.'
  }
  loading.value = false
}

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

// In quick play we get a brand new set of species every time
async function playAgain() {
  mapRef.value.reset()
  guess.value = null
  mapOpen.value = false
  currentRound.value = 0
  score.value = 0
  stage.value = 'guessing'
  await loadRounds()
}
</script>

<template>
  <div class="relative h-full overflow-hidden">

    <p v-if="loading" class="p-6 md:p-10 text-xl">Picking some species...</p>

    <p v-else-if="error" class="p-6 md:p-10 text-xl text-red-700">{{ error }}</p>

    <p v-else-if="subjects.length === 0" class="p-6 md:p-10 text-xl">
      There are no species in the database yet.
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
        :isDaily="false"
        @playAgain="playAgain"
      />

      <MapBar
        v-if="mapOpen && stage === 'guessing'"
        :hasPin="guess !== null"
        @guess="makeGuess"
        @backToPhoto="backToPhoto"
      />

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