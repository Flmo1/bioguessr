<script setup>
import { ref } from 'vue'
import { searchSpecies, getLocation } from '@/services/inaturalistService'

const emit = defineEmits(['import'])

const search = ref('')
const results = ref([])
const loading = ref(false)
const importing = ref(false)
const error = ref('')
const searched = ref(false)

async function doSearch() {
  error.value = ''
  results.value = []

  if (!search.value) {
    error.value = 'Type a species name first.'
    return
  }

  loading.value = true
  try {
    results.value = await searchSpecies(search.value)
    searched.value = true
  } catch (err) {
    console.log(err)
    error.value = 'Could not reach iNaturalist. Try again.'
  }
  loading.value = false
}

async function useSpecies(species) {
  error.value = ''
  importing.value = true

  try {
    const place = await getLocation(species.id)

    if (!place) {
      error.value = 'No sightings with a location were found for this species.'
      importing.value = false
      return
    }

    // Send the filled in data up to the admin page
    emit('import', {
      name: species.commonName,
      scientificName: species.scientificName,
      type: 'animal',
      photoUrl: species.photoUrl,
      photoCredit: species.photoCredit,
      funFact: species.wikipedia.replace(/<[^>]*>/g, '').slice(0, 300),
      clues: ['Seen ' + place.sightings + ' times on iNaturalist'],
      lat: place.lat,
      lng: place.lng,
      radius: place.radius,
    })
  } catch (err) {
    console.log(err)
    error.value = 'Could not get the location for this species.'
  }

  importing.value = false
}
</script>

<template>
  <div class="bg-white rounded-2xl p-6 mb-8">

    <h2 class="font-display font-bold text-2xl mb-2">Import from iNaturalist</h2>
    <p class="mb-4">
      Search a species, pick one, and the form below gets filled in with a real photo
      and the area where people have actually seen it.
    </p>

    <div class="flex gap-3 mb-4">
      <input
        v-model="search"
        @keyup.enter="doSearch"
        placeholder="For example: red panda"
        class="flex-1 border border-sand rounded-lg p-2"
      />
      <button @click="doSearch" class="bg-olive text-white font-bold px-6 py-2 rounded-full">
        Search
      </button>
    </div>

    <p v-if="error" class="text-red-700 mb-4">{{ error }}</p>

    <p v-if="loading">Searching iNaturalist...</p>

    <p v-else-if="importing">Getting the location from real sightings...</p>

    <p v-else-if="searched && results.length === 0">
      No species found with a photo. Try another name.
    </p>

    <div v-else class="grid grid-cols-4 gap-4">
      <div v-for="species in results" :key="species.id" class="border border-sand rounded-xl p-3">
        <img :src="species.photoUrl" :alt="species.commonName" class="w-full h-28 object-cover rounded-lg mb-2" />
        <p class="font-bold">{{ species.commonName }}</p>
        <p class="italic text-sm mb-2">{{ species.scientificName }}</p>
        <button @click="useSpecies(species)" class="bg-forest text-white px-4 py-2 rounded-full w-full">
          Use this one
        </button>
      </div>
    </div>

  </div>
</template>