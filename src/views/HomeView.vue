<script setup>
import HeroSection from '@/components/HeroSection.vue'
import ModeCard from '@/components/ModeCard.vue'
import ModeCardQuick from '@/components/ModeCardQuick.vue'
import ModeCardPvP from '@/components/ModeCardPvP.vue'
</script>

<template>
  <div class="overflow-x-hidden">

    <HeroSection />

    <section class="max-w-[1200px] mx-auto px-4 md:px-6 pb-16">

      <h2 class="font-display font-bold text-3xl md:text-5xl mb-4">Game modes</h2>
      <p class="text-lg max-w-2xl mb-8 md:mb-10">
        Choose how you want to explore: quick daily drops, quick play dives, or
        competitive matches against other players.
      </p>

      <!-- One under the other on a phone, side by side on a big screen -->
      <div class="flex flex-col md:flex-row gap-6 md:gap-8">
        <ModeCard />
        <ModeCardQuick />
        <ModeCardPvP />
      </div>

    </section>

  </div>
</template>