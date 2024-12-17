<template>
  <div class="mx-auto bg-white shadow-md rounded-lg p-6">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Create a Post</h2>
    <form @submit.prevent="handleSubmit">
      <!-- Title -->
      <div class="mb-4">
        <label for="title" class="block text-gray-700 font-medium mb-2">Title</label>
        <input
          id="title"
          v-model="postStore.post.title"
          type="text"
          :class="[
          'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400',
          postStore.errors.title ? 'border-red-500' : 'border-gray-300'
          ]"
          placeholder="Enter post title"
          @focus="postStore.errors.title=''"
        />
        <p v-if="postStore.errors.title" class="text-red-100 my-3 p-3 font-medium bg-red-700">{{ postStore.errors.title }}</p>
      </div>
      <!-- Content -->
      <div class="mb-4">
        <label for="content" class="block text-gray-700 font-medium mb-2">Content</label>
        <textarea
          id="content"
          v-model="postStore.post.content"
          rows="4"
          :class="[
          'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400',
          postStore.errors.content ? 'border-red-500' : 'border-gray-300'
          ]"
          placeholder="Enter post content"
          @focus="postStore.errors.content=''"
        ></textarea>
        <p v-if="postStore.errors.content" class="text-red-100 my-3 p-3 font-medium bg-red-700">{{ postStore.errors.content }}</p>
      </div>

      <!-- Category -->
      <div class="mb-4">
        <label for="category" class="block text-gray-700 font-medium mb-2">Category</label>
        <select
          id="category"
          v-model="postStore.post.category"
          :class="[
          'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400',
          postStore.errors.category ? 'border-red-500' : 'border-gray-300'
          ]"
        >
          <option value="" disabled>Select a category</option>
          <option v-for="category in categoryStore.categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
        <p v-if="postStore.errors.category" class="text-red-100 my-3 p-3 font-medium bg-red-700">{{ postStore.errors.category }}</p>
      </div>

      <!-- Submit Button -->
      <div class="mt-6 flex justify-between">
        <button
          type="submit"
          class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Create Post
        </button>
        <RouterLink
          to="/"
          class="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >Go Back</RouterLink
        >
      </div>
    </form>
  </div>
</template>

<script setup>
import router from '@/router'
import { onBeforeMount } from 'vue';
import { useRoute } from 'vue-router'
import { useUtilsStore } from '@/store/utilsStore'
import { usePostStore } from '@/store/postStore'
import { useCategoryStore } from '@/store/categoryStore'

const utilsStore = useUtilsStore()
const postStore = usePostStore()
const categoryStore = useCategoryStore()
const route = useRoute()

const fetchCategories = async () => {
  await categoryStore.getCategories()
}

onBeforeMount(() => {
  fetchCategories()
})

// Form submission handler
const handleSubmit = async () => {
  const requiredFields = [
    { key: 'title', message: 'Title for a post is required.' },
    { key: 'content', message: 'Content for a post is required.' },
    { key: 'category', message: 'Category for a post is required.' }
  ];

  for (const field of requiredFields) {
    if (!postStore.post[field.key]) {
      postStore.errors[field.key] = field.message;
      return;
    }
  }
  await postStore.addPost()
  postStore.isCreated = false
}
</script>

<style scoped>
</style>
