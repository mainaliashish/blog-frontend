<template>
  <div class="flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
      <h2 class="text-2xl font-bold text-center text-gray-700 mb-4">Login</h2>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-600">Email</label>
          <input
            type="email"
            id="email"
            v-model="authStore.loginData.email"
            class="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
            required
          />
        </div>

        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-gray-600">Password</label>
          <input
            type="password"
            id="password"
            v-model="authStore.loginData.password"
            class="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
            required
          />
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="text-red-500 text-sm mb-4">
          {{ errorMessage }}
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="w-full p-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          :disabled="authStore.networkRequest"
        >
          Login
        </button>

        <!-- Register Link -->
        <p class="mt-4 text-center text-sm text-gray-600">
          Don't have an account?
          <router-link to="/register" class="text-blue-500 hover:text-blue-600"
            >Sign up</router-link
          >
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { useAuthStore } from '@/store/authStore'

const authStore = useAuthStore()
const errorMessage = ref('')

watchEffect(() => {
  if(authStore.isLogout) {
    authStore.utilsStore.handleSuccess("Logout Successfully..")
  }
  authStore.isLogout = false
})

const handleLogin = async () => {
  authStore.networkRequest = true
  errorMessage.value = ''
  try {
    await authStore.login()
  } catch (error) {
    errorMessage.value = error.message || 'Login failed. Please try again.'
  } finally {
    authStore.networkRequest = false
  }
}
</script>

<style scoped>
/* You can add custom styles here if necessary */
</style>
