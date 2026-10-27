<script setup>
import LoginForm from '@/components/LoginForm.vue'
</script>

<template>
  <div class="max-w-md mx-auto px-6 py-20">
    <h1 class="font-display font-bold text-5xl mb-8">Log in</h1>
    <LoginForm />
        <p class="mt-6">
      No account yet?
      <RouterLink to="/register" class="font-bold underline">Create one</RouterLink>
    </p>
  </div>
</template>