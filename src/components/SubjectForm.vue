<script setup>
import { ref } from 'vue'

const props = defineProps({
  subject: Object,
})

const emit = defineEmits(['save', 'cancel'])

// If i got a subject, im are editing it If not, the fields start empty.
const name = ref(props.subject ? props.subject.name : '')
const scientificName = ref(props.subject ? props.subject.scientificName : '')
const type = ref(props.subject ? props.subject.type : 'animal')
const photoUrl = ref(props.subject ? props.subject.photoUrl : '')
const photoUrl2 = ref(props.subject ? props.subject.photoUrl2 : '')
const photoCredit = ref(props.subject ? props.subject.photoCredit : '')
const funFact = ref(props.subject ? props.subject.funFact : '')
const lat = ref(props.subject ? props.subject.lat : '')
const lng = ref(props.subject ? props.subject.lng : '')
const radius = ref(props.subject ? props.subject.radius : 300)

// In Appwrite clues is a list, but it is easier to type them as one line
const cluesText = ref(
  props.subject && props.subject.clues ? props.subject.clues.join(', ') : ''
)

const error = ref('')

function save() {
  error.value = ''

  if (!name.value || !photoUrl.value || lat.value === '' || lng.value === '') {
    error.value = 'Name, photo URL, latitude and longitude are required.'
    return
  }

  // Turn "Warm climate, Forest edge" into ['Warm climate', 'Forest edge']
  const clues = []
  for (const piece of cluesText.value.split(',')) {
    const clue = piece.trim()
    if (clue !== '') {
      clues.push(clue)
    }
  }

  emit('save', {
    name: name.value,
    scientificName: scientificName.value,
    type: type.value,
    photoUrl: photoUrl.value,
    photoUrl2: photoUrl2.value,
    photoCredit: photoCredit.value,
    funFact: funFact.value,
    clues: clues,
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

    <label class="block font-bold mb-1">Second photo URL (optional)</label>
    <input v-model="photoUrl2" class="w-full border border-sand rounded-lg p-2 mb-4" />

    <label class="block font-bold mb-1">Photo credit</label>
    <input v-model="photoCredit" class="w-full border border-sand rounded-lg p-2 mb-4" />

    <label class="block font-bold mb-1">Fun fact</label>
    <textarea v-model="funFact" class="w-full border border-sand rounded-lg p-2 mb-4"></textarea>

    <label class="block font-bold mb-1">Clues</label>
    <input
      v-model="cluesText"
      placeholder="Warm climate, Forest edge"
      class="w-full border border-sand rounded-lg p-2 mb-1"
    />
    <p class="text-sm mb-4">Separate each clue with a comma.</p>

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