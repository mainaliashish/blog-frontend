<template>
  <div class="flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
      <h2 class="text-2xl font-bold text-center text-gray-700 mb-4">Register</h2>

      <form @submit.prevent="handleRegister">
        <div class="mb-4">
          <label for="name" class="block text-sm font-medium text-gray-600">Full Name</label>
          <input
            type="text"
            id="name"
            v-model="authStore.registerData.name"
            class="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your full name"
            @focus="authStore.validationError = false"
            required
          />
        </div>

        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-600">Email</label>
          <input
            type="email"
            id="email"
            v-model="authStore.registerData.email"
            class="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
            @focus="authStore.validationError = false"
            required
          />
        </div>

        <div class="mb-4">
          <label for="password" class="block text-sm font-medium text-gray-600">Password</label>
          <input
            type="password"
            id="password"
            v-model="authStore.registerData.password"
            class="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
            @focus="authStore.validationError = false"
            required
          />
        </div>

        <div class="mb-6">
          <label for="confirmPassword" class="block text-sm font-medium text-gray-600"
            >Confirm Password</label
          >
          <input
            type="password"
            id="confirmPassword"
            v-model="authStore.registerData.c_password"
            class="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Confirm your password"
            @focus="authStore.validationError = false"
            required
          />
        </div>
        <div v-if="errorMessage" class="text-red-500 text-sm mb-4">
          {{ errorMessage }}
        </div>

        <div v-if="authStore.validationError" class="bg-red-100 border-l-4 border-red-500 p-4 mb-4">
          <p class="text-red-500 font-semibold mb-2">Validation Errors:</p>
          <ul class="list-inside space-y-2">
            <li v-for="key in authStore.validationErrors" :key="key" class="text-red-600 text-sm">
              {{ key.toString() }}
            </li>
          </ul>
        </div>
        <button
          type="submit"
          class="w-full p-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          :disabled="authStore.networkRequest"
        >
          Register
        </button>

        <!-- Login Link -->
        <p class="mt-4 text-center text-sm text-gray-600">
          Already have an account?
          <router-link to="/login" class="text-blue-500 hover:text-blue-600">Login</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/store/authStore'

const authStore = useAuthStore()
const errorMessage = ref('')

const handleRegister = async () => {
  authStore.networkRequest = true
  errorMessage.value = ''

  if (authStore.registerData.password !== authStore.registerData.c_password) {
    errorMessage.value = 'Passwords do not match.'
    authStore.networkRequest = false
    return
  }

  try {
    const response = await authStore.register()
    if (!response) {
      throw new Error('Registration failed. Please try again.')
    }
  } catch (error) {
    errorMessage.value = error.message || 'Registration failed. Please try again.'
  } finally {
    authStore.networkRequest = false
  }
}
</script>

<style scoped>
/* You can add custom styles here if necessary */
</style>
