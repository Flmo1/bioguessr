<script setup>
import RegisterForm from '@/components/RegisterForm.vue'
</script>

<template>
  <main class="max-w-md mx-auto px-6 py-20">
    <h1 class="font-display font-bold text-5xl mb-2">Create an account</h1>
    <p class="mb-8">Sign up to play the daily expedition.</p>

    <RegisterForm />

    <p class="mt-6">
      Already have an account?
      <RouterLink to="/login" class="font-bold underline">Log in</RouterLink>
    </p>
  </main>
</template>