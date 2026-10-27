<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { getRandomSubjects } from '@/services/subjectService'

const subjects = ref([])
const current = ref(0)
const loading = ref(true)

// Expedition number, goes up by one every day
const expeditionNumber = ref(0)

const timeLeft = ref('')

let photoTimer = null
let clockTimer = null

onMounted(async () => {
  updateTime()
  updateNumber()
  clockTimer = setInterval(updateTime, 30000)

  try {
    subjects.value = await getRandomSubjects()
  } catch (err) {
    console.log(err)
  }
  loading.value = false

  // Change the photo every 7 seconds
  photoTimer = setInterval(nextPhoto, 13000)
})

// Stop the timers when we leave the page
onUnmounted(() => {
  clearInterval(photoTimer)
  clearInterval(clockTimer)
})

function nextPhoto() {
  if (subjects.value.length === 0) return

  if (current.value === subjects.value.length - 1) {
    current.value = 0
  } else {
    current.value = current.value + 1
  }
}

function updateTime() {
  const now = new Date()
  const midnight = new Date()
  midnight.setHours(24, 0, 0, 0)

  const minutes = Math.floor((midnight - now) / 60000)
  const hours = Math.floor(minutes / 60)

  timeLeft.value = hours + ' h ' + (minutes % 60) + ' min'
}

function updateNumber() {
  // How many days since the game started
  const start = new Date(2026, 0, 1)
  const now = new Date()
  const days = Math.floor((now - start) / 86400000)
  expeditionNumber.value = days
}
</script>

<template>
  <section class="max-w-[1200px] mx-auto px-6 py-20">
    <div class="flex items-center gap-24">

      <div class="w-[420px]">

        <!-- Fixed size box, so a tall or wide photo never changes the layout -->
        <div class="w-[420px] h-[420px] rounded-[60px] overflow-hidden bg-white">

          <p v-if="loading" class="p-10">Loading photos...</p>

          <Transition name="fade" mode="out-in">
            <img
              v-if="subjects.length > 0"
              :key="subjects[current].$id"
              :src="subjects[current].photoUrl"
              :alt="'Photo of a ' + subjects[current].name"
              class="w-full h-full object-cover"
            />
          </Transition>

        </div>

        <!-- Fixed height box, so the credit never pushes the page around
             while one line fades out and the next fades in -->
        <div class="h-6 mt-3 overflow-hidden">
          <Transition name="fade" mode="out-in">
            <p
              v-if="subjects.length > 0"
              :key="subjects[current].$id"
              class="text-sm text-bark truncate"
            >
              {{ subjects[current].photoCredit }}
            </p>
          </Transition>
        </div>

      </div>

      <div>
        <h1 class="font-display font-bold text-6xl mb-6">
          Expedition #{{ expeditionNumber }}
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

<style scoped>
/* The photo fades out, then the new one fades in */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>