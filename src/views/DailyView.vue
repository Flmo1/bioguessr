<script setup>
import { ref } from 'vue'
import GameMap from '@/components/GameMap.vue'
import ScoreBox from '@/components/ScoreBox.vue'
import RoundPanel from '@/components/RoundPanel.vue'

// Fake data for now. Later this comes from Appwrite.
const round = ref({
  number: 1,
  total: 3,
  difficulty: 'Easy',
  photo: '/squirrel.webp',
  photoAlt: 'A striped squirrel on a tree trunk',
  clues: ['Warm climate', 'Forest edge'],
})

const score = ref(12)
const guess = ref(null)

function savePin(latlng) {
  guess.value = latlng
}

function makeGuess() {
  // Step 2 will put the scoring here
  console.log('Guess:', guess.value.lat, guess.value.lng)
}
</script>

<template>
  <div class="relative h-[calc(100vh-88px)] overflow-hidden">
    <GameMap @pin="savePin" />
    <ScoreBox :score="score" />
    <RoundPanel :round="round" :hasPin="guess !== null" @guess="makeGuess" />
  </div>
</template>