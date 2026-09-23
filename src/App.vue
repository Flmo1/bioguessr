<script setup>
import NavBar from '@/components/NavBar.vue'
import HeroSection from '@/components/HeroSection.vue'
import ModeCard from './components/ModeCard.vue';
import ModeCardQuick from './components/ModeCardQuick.vue';
import ModeCardPvP from './components/ModeCardPvP.vue';
</script>

<template>
  <NavBar />
  <HeroSection />
<div class="flex gap-8 max-w-[1200px] mx-auto px-6">
  <ModeCard />
  <ModeCardQuick />
  <ModeCardPvP />
</div>
  <RouterView />
</template>