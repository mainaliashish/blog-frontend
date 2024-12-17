<template>
  <div class="mx-auto bg-white shadow-md rounded-lg p-6">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Update a Post</h2>
    <form @submit.prevent="handleSubmit">
      <!-- Title -->
      <div class="mb-4">
        <label for="title" class="block text-gray-700 font-medium mb-2">Title</label>
        <input
          id="title"
          v-model="postStore.currentPost.title"
          type="text"
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter post title"
          required
        />
      </div>
      <!-- Content -->
      <div class="mb-4">
        <label for="content" class="block text-gray-700 font-medium mb-2">Content</label>
        <textarea
          id="content"
          v-model="postStore.currentPost.content"
          rows="4"
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter post content"
          required
        ></textarea>
      </div>

      <!-- Category -->
      <div class="mb-4">
        <label for="category" class="block text-gray-700 font-medium mb-2">Category</label>
        <select
          id="category"
          v-model="postStore.currentPost.category"
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        >
          <option value="" disabled>Select a category</option>
          <option v-for="category in categoryStore.categories"
                  :key="category.id"
                  :value="category.name"
                  :selected="postStore.currentPost.category === category.name">
            {{ category.name }}
          </option>
        </select>
      </div>

      <!-- Submit Button -->
      <div class="mt-6 flex justify-between">
        <button
          type="submit"
          class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Update Post
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
import { onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { usePostStore } from '@/store/postStore'
import { useCategoryStore } from '@/store/categoryStore'

const postStore = usePostStore()
const categoryStore = useCategoryStore()
const route = useRoute()

const fetchCategories = async () => {
  await categoryStore.getCategories()
}

const fetchCurrentPost = async () => {
  const postId = route.params.id.toString()
  await postStore.getPostById(postId)
}

onBeforeMount(() => {
  fetchCategories()
  fetchCurrentPost()
})

// Form submission handler
const handleSubmit = async () => {
  await postStore.updatePost(route.params.id.toString())
}
</script>

<style scoped>
</style>
