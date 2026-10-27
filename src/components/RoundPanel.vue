<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  subject: Object,
  roundNumber: Number,
  totalRounds: Number,
  hasPin: Boolean,
})

const emit = defineEmits(['guess'])

// All the photos this species has (one or two)
const photos = computed(() => {
  const list = [props.subject.photoUrl]
  if (props.subject.photoUrl2) {
    list.push(props.subject.photoUrl2)
  }
  return list
})

// Which photo is the big one right now
const currentPhoto = ref(0)

const zoom = ref(1)
const offsetX = ref(0)
const offsetY = ref(0)
const dragging = ref(false)

let startX = 0
let startY = 0

function pickPhoto(index) {
  currentPhoto.value = index
  resetZoom()
}

function handleWheel(event) {
  if (event.deltaY < 0) {
    zoom.value = zoom.value + 0.3
  } else {
    zoom.value = zoom.value - 0.3
  }

  if (zoom.value < 1) zoom.value = 1
  if (zoom.value > 5) zoom.value = 5

  if (zoom.value === 1) {
    offsetX.value = 0
    offsetY.value = 0
  } else {
    keepInside()
  }
}

function startDrag(event) {
  if (zoom.value === 1) return
  dragging.value = true
  startX = event.clientX - offsetX.value
  startY = event.clientY - offsetY.value
}

function doDrag(event) {
  if (!dragging.value) return
  offsetX.value = event.clientX - startX
  offsetY.value = event.clientY - startY
  keepInside()
}

function stopDrag() {
  dragging.value = false
}

function keepInside() {
  const maxX = (zoom.value - 1) * 160
  const maxY = (zoom.value - 1) * 140

  if (offsetX.value > maxX) offsetX.value = maxX
  if (offsetX.value < -maxX) offsetX.value = -maxX
  if (offsetY.value > maxY) offsetY.value = maxY
  if (offsetY.value < -maxY) offsetY.value = -maxY
}

function resetZoom() {
  zoom.value = 1
  offsetX.value = 0
  offsetY.value = 0
}
</script>

<template>
  <div class="absolute top-6 bottom-6 left-6 z-[1000] w-[400px] bg-sand rounded-3xl p-7 flex flex-col overflow-y-auto">

    <p class="text-sm text-bark">Round {{ roundNumber }} of {{ totalRounds }}</p>
    <h1 class="font-display font-bold text-4xl mb-5">Guess the habitat</h1>

    <!-- Scroll to zoom, then hold the mouse down and drag to look around -->
    <div
      @wheel.prevent="handleWheel"
      @mousedown.prevent="startDrag"
      @mousemove="doDrag"
      @mouseup="stopDrag"
      @mouseleave="stopDrag"
      class="relative w-full h-80 overflow-hidden rounded-2xl mb-3"
      :class="zoom > 1 ? (dragging ? 'cursor-grabbing' : 'cursor-grab') : ''"
    >
      <img
        :src="photos[currentPhoto]"
        :alt="'Photo of a ' + subject.name"
        :style="{
          transform: 'translate(' + offsetX + 'px, ' + offsetY + 'px) scale(' + zoom + ')'
        }"
        :class="dragging ? '' : 'zoom-photo'"
        class="w-full h-full object-cover select-none"
        draggable="false"
      />

      <span class="absolute top-3 right-3 bg-white text-xs px-3 py-1 rounded-full">
        {{ currentPhoto + 1 }}/{{ photos.length }}
      </span>

      <button
        v-if="zoom > 1"
        @click="resetZoom"
        class="absolute bottom-3 right-3 bg-white text-sm px-3 py-1 rounded-full"
      >
        Reset
      </button>

      <span
        v-else
        class="absolute bottom-3 right-3 bg-white text-xs px-3 py-1 rounded-full"
      >
        Scroll to zoom
      </span>
    </div>

    <!-- Small pictures to switch between, only if there is more than one -->
    <div v-if="photos.length > 1" class="flex gap-3 mb-3">
      <button
        v-for="(photo, index) in photos"
        :key="photo"
        @click="pickPhoto(index)"
        class="w-20 h-20 rounded-xl overflow-hidden"
        :class="currentPhoto === index ? 'ring-4 ring-olive' : 'opacity-60'"
      >
        <img :src="photo" :alt="'Another photo of a ' + subject.name" class="w-full h-full object-cover" />
      </button>
    </div>

    <p class="text-xs text-bark mb-4">{{ subject.photoCredit }}</p>

    <div class="flex flex-wrap gap-2 mb-5">
      <span v-for="clue in subject.clues" :key="clue" class="bg-white text-sm px-3 py-1 rounded-full">
        {{ clue }}
      </span>
    </div>

    <p class="font-bold mb-4">Drop a pin where you think this species lives.</p>

    <button
      @click="emit('guess')"
      :disabled="!hasPin"
      class="mt-auto w-full rounded-full py-4 font-bold text-white text-lg"
      :class="hasPin ? 'bg-olive' : 'bg-bark opacity-50'"
    >
      {{ hasPin ? 'Guess' : 'Place a pin first' }}
    </button>

  </div>
</template>

<style scoped>
.zoom-photo {
  transition: transform 0.2s ease;
}
</style>