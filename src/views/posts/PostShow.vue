<template>
<div class="border border-gray-300 shadow-lg rounded-lg p-6 max-w-2xl mx-auto bg-white">
  <!-- Post Title -->
  <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ postStore.currentPost.title }}</h2>

  <!-- Post Content -->
  <div class="mb-4">
    <h3 class="text-lg font-semibold text-gray-700">Content:</h3>
    <p class="text-gray-600">
      {{ postStore.currentPost.content }}
    </p>
  </div>

  <!-- Post Metadata -->
  <div class="grid grid-cols-3 gap-4 mb-6">
    <div>
      <h3 class="text-lg font-semibold text-gray-700">Category:</h3>
      <p class="text-gray-600">{{ postStore.currentPost?.category }}</p>
    </div>
    <div>
      <h3 class="text-lg font-semibold text-gray-700">Author:</h3>
      <p class="text-gray-600">{{ postStore.currentPost?.author }}</p>
    </div>
    <div>
      <h3 class="text-lg font-semibold text-gray-700">Publication Date:</h3>
      <p class="text-gray-600">{{ postStore.currentPost?.publication_date }}</p>
    </div>
  </div>

  <div class="flex justify-between space-x-4">
      <RouterLink
          to="/"
          class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >Go Back</RouterLink
        >
  </div>
</div>

</template>

<script setup>
import { onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { usePostStore } from '@/store/postStore'

const postStore = usePostStore()
const route = useRoute()

const fetchPostById = async () => {
  const postId = route.params.id.toString()
  await postStore.getPostById(postId)
}

onBeforeMount(() => {
  fetchPostById()
})


</script>
