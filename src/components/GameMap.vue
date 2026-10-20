<script setup>
import { onMounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const emit = defineEmits(['pin'])

let map = null
let marker = null
let answerMarker = null
let line = null

const pinIcon = L.divIcon({
  className: '',
  html: '<div style="width:22px;height:22px;border-radius:50%;background:#6D8C2A;border:3px solid white;"></div>',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
})

const answerIcon = L.divIcon({
  className: '',
  html: '<div style="width:22px;height:22px;border-radius:50%;background:#E8483B;border:3px solid white;"></div>',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
})

onMounted(() => {
  map = L.map('map', {
    zoomControl: false,
    worldCopyJump: true,
    minZoom: 2,
  }).setView([20, 0], 2)

  L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    { attribution: 'Tiles © Esri', maxZoom: 16 }
  ).addTo(map)

  map.on('click', (event) => {
    // Do not let the player move the pin after they guessed
    if (answerMarker) return

    if (marker) {
      marker.setLatLng(event.latlng)
    } else {
      marker = L.marker(event.latlng, { icon: pinIcon }).addTo(map)
    }

    emit('pin', event.latlng)
  })
})

// Show the real place and draw a line from the guess to it
function showAnswer(lat, lng) {
  answerMarker = L.marker([lat, lng], { icon: answerIcon }).addTo(map)

  line = L.polyline([marker.getLatLng(), [lat, lng]], {
    color: '#ffffff',
    dashArray: '6, 8',
  }).addTo(map)

  map.fitBounds(line.getBounds(), { padding: [80, 80] })
}

// Clear everything before the next round
function reset() {
  if (marker) map.removeLayer(marker)
  if (answerMarker) map.removeLayer(answerMarker)
  if (line) map.removeLayer(line)

  marker = null
  answerMarker = null
  line = null

  map.setView([20, 0], 2)
}

function zoomIn() {
  map.zoomIn()
}

function zoomOut() {
  map.zoomOut()
}

// Let DailyView call showAnswer() and reset()
defineExpose({ showAnswer, reset })
</script>

<template>
  <div class="absolute inset-0">
    <div id="map" class="w-full h-full"></div>

    <div class="absolute top-28 right-6 z-[1000] flex flex-col gap-3">
      <button @click="zoomIn" class="w-10 h-10 rounded-full bg-sand font-bold text-xl">+</button>
      <button @click="zoomOut" class="w-10 h-10 rounded-full bg-sand font-bold text-xl">−</button>
    </div>
  </div>
</template>