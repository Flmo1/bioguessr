<script setup>
import { ref } from 'vue'

const props = defineProps({
  subject: Object,
})

const emit = defineEmits(['save', 'cancel'])

// If we got a subject, we are editing it. If not, the fields start empty.
const name = ref(props.subject ? props.subject.name : '')
const scientificName = ref(props.subject ? props.subject.scientificName : '')
const type = ref(props.subject ? props.subject.type : 'animal')
const photoUrl = ref(props.subject ? props.subject.photoUrl : '')
const photoCredit = ref(props.subject ? props.subject.photoCredit : '')
const funFact = ref(props.subject ? props.subject.funFact : '')
const lat = ref(props.subject ? props.subject.lat : '')
const lng = ref(props.subject ? props.subject.lng : '')
const radius = ref(props.subject ? props.subject.radius : 300)

const error = ref('')

function save() {
  error.value = ''

  if (!name.value || !photoUrl.value || lat.value === '' || lng.value === '') {
    error.value = 'Name, photo URL, latitude and longitude are required.'
    return
  }

  emit('save', {
    name: name.value,
    scientificName: scientificName.value,
    type: type.value,
    photoUrl: photoUrl.value,
    photoCredit: photoCredit.value,
    funFact: funFact.value,
    lat: Number(lat.value),
    lng: Number(lng.value),
    radius: Number(radius.value),
  })
}
</script>

<template>
  <div class="bg-white rounded-2xl p-6 mb-8">

    <h2 class="font-display font-bold text-2xl mb-4">
      {{ subject ? 'Edit species' : 'Add a species' }}
    </h2>

    <label class="block font-bold mb-1">Name</label>
    <input v-model="name" class="w-full border border-sand rounded-lg p-2 mb-4" />

    <label class="block font-bold mb-1">Scientific name</label>
    <input v-model="scientificName" class="w-full border border-sand rounded-lg p-2 mb-4" />

    <label class="block font-bold mb-1">Type</label>
    <select v-model="type" class="w-full border border-sand rounded-lg p-2 mb-4">
      <option value="animal">animal</option>
      <option value="plant">plant</option>
      <option value="fungus">fungus</option>
      <option value="place">place</option>
    </select>

    <label class="block font-bold mb-1">Photo URL</label>
    <input v-model="photoUrl" class="w-full border border-sand rounded-lg p-2 mb-4" />

    <label class="block font-bold mb-1">Photo credit</label>
    <input v-model="photoCredit" class="w-full border border-sand rounded-lg p-2 mb-4" />

    <label class="block font-bold mb-1">Fun fact</label>
    <textarea v-model="funFact" class="w-full border border-sand rounded-lg p-2 mb-4"></textarea>

    <label class="block font-bold mb-1">Latitude</label>
    <input v-model="lat" type="number" class="w-full border border-sand rounded-lg p-2 mb-4" />

    <label class="block font-bold mb-1">Longitude</label>
    <input v-model="lng" type="number" class="w-full border border-sand rounded-lg p-2 mb-4" />

    <label class="block font-bold mb-1">Radius in km</label>
    <input v-model="radius" type="number" class="w-full border border-sand rounded-lg p-2 mb-4" />

    <p v-if="error" class="text-red-700 mb-4">{{ error }}</p>

    <button @click="save" class="bg-olive text-white font-bold px-6 py-3 rounded-full mr-3">
      Save
    </button>
    <button @click="emit('cancel')" class="bg-bark text-white font-bold px-6 py-3 rounded-full">
      Cancel
    </button>

  </div>
</template>