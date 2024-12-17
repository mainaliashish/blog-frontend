<template>
  <!-- Navbar -->
  <header class="bg-white shadow-md">
    <nav class="container mx-auto px-4 py-4 flex justify-between items-center">
      <RouterLink to="/" class="text-2xl font-bold text-blue-600"> Blog App </RouterLink>
      <ul class="flex space-x-4">
        <li>
          <router-link
            to="/posts"
            class="text-gray-700 hover:text-blue-500 transition duration-300"
            active-class="text-blue-600 font-semibold"
          >
            Posts
          </router-link>
        </li>

      </ul>
    </nav>
  </header>
</template>
<script>
import { RouterLink } from 'vue-router'
</script>
