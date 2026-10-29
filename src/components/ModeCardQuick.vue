<template>
  <div class="bg-white rounded-3xl p-6 md:p-8 w-full md:w-1/3">

    <div class="flex items-center justify-between mb-6">
      <div class="w-12 h-12 rounded-full bg-sand flex items-center justify-center">
        ⚡
      </div>
      <span class="bg-sand text-forest text-sm font-bold px-3 py-1 rounded-full">
        Quick play
      </span>
    </div>

    <h3 class="font-display font-bold text-2xl md:text-3xl mb-3">Quick play</h3>

    <p class="mb-8">
      Five random species from around the world. A different set every time you play.
    </p>

    <RouterLink to="/quick" class="flex items-center justify-between text-olive font-bold">
      Play now
      <span class="w-9 h-9 rounded-full bg-sand flex items-center justify-center">→</span>
    </RouterLink>

  </div>
</template>