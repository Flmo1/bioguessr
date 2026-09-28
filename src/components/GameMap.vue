<script setup>
import { onMounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Tells the parent where the player clicked
const emit = defineEmits(['pin'])

let map = null
let marker = null

const pinIcon = L.divIcon({
  className: '',
  html: '<div style="width:22px;height:22px;border-radius:50%;background:#6D8C2A;border:3px solid white;"></div>',
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
    if (marker) {
      marker.setLatLng(event.latlng)
    } else {
      marker = L.marker(event.latlng, { icon: pinIcon }).addTo(map)
    }

    emit('pin', event.latlng)
  })
})

function zoomIn() {
  map.zoomIn()
}

function zoomOut() {
  map.zoomOut()
}
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