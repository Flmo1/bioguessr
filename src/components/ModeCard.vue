<template>
  <div class="bg-white rounded-3xl p-8 w-1/3">

    <div class="flex items-center justify-between mb-6">
      <div class="w-12 h-12 rounded-full bg-sand flex items-center justify-center">
        📅
      </div>
      <span class="bg-sand text-olive text-sm font-bold px-3 py-1 rounded-full">
        Daily
      </span>
    </div>

    <h3 class="font-display font-bold text-3xl mb-3">Daily</h3>

    <p class="mb-8">
      A fresh mystery every day with one set of photos and one chance to pin the location.
    </p>

    <RouterLink to="/daily" class="flex items-center justify-between text-olive font-bold">
      Play now
      <span class="w-9 h-9 rounded-full bg-sand flex items-center justify-center">→</span>
    </RouterLink>

  </div>
</template>