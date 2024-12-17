<template>
  <div class="min-h-screen flex flex-col bg-gray-100">
    <AppHeader />
    <!-- Main Content -->
    <main class="flex-grow container mx-auto px-4 py-6">
      <router-view />
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
</script>

<style scoped></style>
