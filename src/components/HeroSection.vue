<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { getRandomSubjects } from '@/services/subjectService'

const subjects = ref([])
const current = ref(0)
const loading = ref(true)

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

  photoTimer = setInterval(nextPhoto, 7000)
})

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
  const start = new Date(2026, 0, 1)
  const now = new Date()
  const days = Math.floor((now - start) / 86400000)
  expeditionNumber.value = days
}
</script>

<template>
  <section class="max-w-[1200px] mx-auto px-4 md:px-6 py-10 md:py-20">

    <!-- Stacked on a phone, side by side on a big screen -->
    <div class="flex flex-col md:flex-row md:items-center gap-8 md:gap-24">

      <div class="w-full max-w-[420px] mx-auto md:mx-0 shrink-0">
        <div class="w-full aspect-square rounded-[40px] md:rounded-[60px] overflow-hidden bg-white">

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
        <h1 class="font-display font-bold text-4xl md:text-6xl mb-4 md:mb-6">
          Expedition #{{ expeditionNumber }}
        </h1>

        <p class="text-lg max-w-md mb-6 md:mb-8">
          Five photos, one hidden corner of the world. Where did we go today?
        </p>

        <div class="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          <RouterLink
            to="/daily"
            class="bg-olive text-white font-bold px-8 py-4 rounded-full text-center"
          >
            Start today's expedition
          </RouterLink>

          <p class="font-hand text-olive text-lg sm:max-w-[140px]">
            new one in {{ timeLeft }}
          </p>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>