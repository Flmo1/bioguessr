<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  subject: Object,
  roundNumber: Number,
  totalRounds: Number,
  hasPin: Boolean,
})

const emit = defineEmits(['guess', 'openMap'])

// All the photos this species has (one or two)
const photos = computed(() => {
  const list = [props.subject.photoUrl]
  if (props.subject.photoUrl2) {
    list.push(props.subject.photoUrl2)
  }
  return list
})

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
  <!-- On a phone this fills the whole screen.
       On a big screen it is a panel on the left. -->
  <div
    class="absolute z-[1000] bg-sand flex flex-col overflow-y-auto
           inset-0 rounded-none p-4
           md:inset-auto md:top-6 md:bottom-6 md:left-6 md:w-[400px] md:rounded-3xl md:p-7"
  >

    <p class="text-sm text-bark">Round {{ roundNumber }} of {{ totalRounds }}</p>
    <h1 class="font-display font-bold text-3xl md:text-4xl mb-4 md:mb-5">Guess the habitat</h1>

    <div
      @wheel.prevent="handleWheel"
      @mousedown.prevent="startDrag"
      @mousemove="doDrag"
      @mouseup="stopDrag"
      @mouseleave="stopDrag"
      class="relative w-full h-56 md:h-80 overflow-hidden rounded-2xl mb-3"
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

      <!-- Scrolling to zoom only makes sense with a mouse -->
      <span
        v-else
        class="hidden md:block absolute bottom-3 right-3 bg-white text-xs px-3 py-1 rounded-full"
      >
        Scroll to zoom
      </span>
    </div>

    <div v-if="photos.length > 1" class="flex gap-3 mb-3">
      <button
        v-for="(photo, index) in photos"
        :key="photo"
        @click="pickPhoto(index)"
        class="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden"
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

    <p class="font-bold mb-4 hidden md:block">Drop a pin where you think this species lives.</p>

    <!-- Phones: open the map. Big screens: guess straight away. -->
    <button
      @click="emit('openMap')"
      class="md:hidden mt-auto w-full rounded-full py-4 font-bold text-white text-lg bg-olive"
    >
      {{ hasPin ? 'Back to the map' : 'Open the map' }}
    </button>

    <button
      @click="emit('guess')"
      :disabled="!hasPin"
      class="hidden md:block mt-auto w-full rounded-full py-4 font-bold text-white text-lg"
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