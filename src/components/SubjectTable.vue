<script setup>
defineProps({
  subjects: Array,
})

const emit = defineEmits(['edit', 'delete'])

function askDelete(subject) {
  if (confirm('Delete ' + subject.name + '?')) {
    emit('delete', subject.$id)
  }
}
</script>

<template>
  <!-- On a phone the table can be scrolled sideways -->
  <div class="overflow-x-auto">
    <table class="w-full min-w-[700px] bg-white rounded-2xl overflow-hidden">
      <thead class="bg-forest text-sand text-left">
        <tr>
          <th class="p-3">Photo</th>
          <th class="p-3">Name</th>
          <th class="p-3">Type</th>
          <th class="p-3">Location</th>
          <th class="p-3">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="subject in subjects" :key="subject.$id" class="border-b border-sand">
          <td class="p-3">
            <img :src="subject.photoUrl" :alt="subject.name" class="w-16 h-16 object-cover rounded-lg" />
          </td>
          <td class="p-3">
            <p class="font-bold">{{ subject.name }}</p>
            <p class="italic text-sm">{{ subject.scientificName }}</p>
          </td>
          <td class="p-3">{{ subject.type }}</td>
          <td class="p-3">{{ subject.lat }}, {{ subject.lng }}</td>
          <td class="p-3 whitespace-nowrap">
            <button @click="emit('edit', subject)" class="bg-olive text-white px-4 py-2 rounded-full mr-2">
              Edit
            </button>
            <button @click="askDelete(subject)" class="bg-red-700 text-white px-4 py-2 rounded-full">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>