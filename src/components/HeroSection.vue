<script setup>
import { ref, onMounted } from 'vue'

// For now this is fake data, then ill wait to apply the APIS  
// Later it comes from Appwrite: today's expedition + its first photo.
const expedition = ref({
  number: 214,
  photo: '/bear.webp',
  photoAlt: 'A black bear with two cubs on a fallen tree',
  photoCredit: 'Photo by @mira_outdoors',
})

//ts the countdown for next expedition, which is midnight 
const timeLeft = ref('')

function updateTime() {
  const now = new Date()
  const midnight = new Date()
  midnight.setHours(24, 0, 0, 0)

  const minutes = Math.floor((midnight - now) / 60000)
  const hours = Math.floor(minutes / 60)

  timeLeft.value = hours + ' h ' + (minutes % 60) + ' min'
}

onMounted(() => {
  updateTime()
  setInterval(updateTime, 30000)
})
</script>

<template>
  <section class="max-w-[1200px] mx-auto px-6 py-20">
    <div class="flex items-center gap-24">

      <div>
        <img
          :src="expedition.photo"
          :alt="expedition.photoAlt"
          class="w-[420px] h-[420px] object-cover rounded-[60px]"
        />
        <p class="text-sm text-bark mt-3">{{ expedition.photoCredit }}</p>
      </div>

      <div>
        <h1 class="font-display font-bold text-6xl mb-6">
          Expedition #{{ expedition.number }}
        </h1>

        <p class="text-lg max-w-md mb-8">
          Five photos, one hidden corner of the world. Where did we go today?
        </p>

        <div class="flex items-center gap-6">
          <RouterLink
            to="/daily"
            class="bg-olive text-white font-bold px-8 py-4 rounded-full"
          >
            Start today's expedition
          </RouterLink>

          <p class="font-hand text-olive text-lg max-w-[140px]">
            new one in {{ timeLeft }}
          </p>
        </div>
      </div>

    </div>
  </section>
</template>