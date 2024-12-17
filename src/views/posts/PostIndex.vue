<template>
  <div class="bg-white shadow-md rounded-lg p-6">
    <div class="flex justify-between items-center text-center py-4 mb-1">
      <h1 class="text-2xl font-semibold text-gray-800">Posts</h1>
      <div class="flex space-x-2">
        <button
          class="text-white px-4 py-1 rounded-md text-sm"
          :class="
            postStore.sortOrder === 'asc' ? 'bg-stone-700' : 'bg-stone-500 hover:bg-stone-600'
          "
          @click="postStore.sortByDate('asc')"
        >
          Sort by Publication Date Asc
        </button>
        <button
          class="text-white px-4 py-1 rounded-md text-sm"
          :class="
            postStore.sortOrder === 'desc' ? 'bg-stone-700' : 'bg-stone-500 hover:bg-stone-600'
          "
          @click="postStore.sortByDate('desc')"
        >
          Sort by Publication Date Desc
        </button>
      </div>
      <button
        class="bg-green-500 hover:bg-green-600 text-white px-4 py-1 btn-md rounded-md text-sm"
        @click="createNewPost"
      >
        Create Post
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="post in postStore.filteredPosts"
        :key="post.id"
        class="border border-gray-300 rounded-lg shadow-sm p-4 hover:bg-gray-50"
      >
        <h2
          class="text-lg font-semibold text-gray-800 cursor-pointer truncate"
          @click="getPostById(post.id)"
        >
          {{ post.title }}
        </h2>
        <p class="text-sm text-gray-600 my-2">
          {{ utilsStore.truncateSentence(post.content, 80) }}
        </p>
        <p class="text-sm text-gray-500">Category: {{ post.category.name }}</p>
        <p class="text-sm text-gray-500">Author: {{ post.author.name }}</p>
        <p class="text-sm text-gray-500">Date: {{ post.publication_date }}</p>
        <div class="mt-4 flex justify-between">
          <button
            @click="getPostById(post.id)"
            class="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-md text-sm"
          >
            Show
          </button>
          <div v-if="userId == post.author.id || role === 'admin'">
            <button
              @click="editPost(post.id)"
              class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm mr-2"
            >
              Edit
            </button>
            <button
              v-if="role === 'admin'"
              @click="deletePost(post.id)"
              class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!postStore.posts.length > 0" class="text-gray-500 text-center py-4">
      No posts available.
    </div>

    <div class="my-4 py-4 flex space-x-3">
      <router-link
        v-if="!authStore.isAuthenticated()"
        to="/login"
        class="text-gray-700 bg-purple-300 hover:text-white transition duration-300 py-2 px-4 border rounded-lg inline-block"
        active-class="text-blue-600 font-semibold"
      >
        Login
      </router-link>
      <router-link
        to="/"
        v-if="authStore.isAuthenticated()"
        @click.prevent="logout()"
        class="text-gray-700 bg-red-400 hover:text-white transition duration-300 py-2 px-4 border rounded-lg inline-block"
      >
        Logout
      </router-link>
      <router-link
        v-if="!authStore.isAuthenticated()"
        to="/register"
        class="text-gray-700 bg-red-400 hover:text-white transition duration-300 py-2 px-4 border rounded-lg inline-block"
      >
        Sign up
      </router-link>
    </div>
  </div>
</template>

<script setup>
import router from '@/router'
import { onBeforeMount, watchEffect } from 'vue'
import { useUtilsStore } from '@/store/utilsStore'
import { usePostStore } from '@/store/postStore'
import { useAuthStore } from '@/store/authStore'

const utilsStore = useUtilsStore()
const postStore = usePostStore()
const authStore = useAuthStore()

const fetchPosts = async () => {
  await postStore.getPosts()
}
onBeforeMount(() => {
  fetchPosts()
  if (postStore.isCreated) {
    postStore.utilsStore.handleSuccess('Post Created Successfully.')
  } else if (postStore.isUpdated) {
    postStore.utilsStore.handleSuccess('Post Updated Successfully.')
  }
})

watchEffect(async () => {
  if (postStore.isCreated || postStore.isUpdated || postStore.isDeleted || postStore.isSorted) {
    await postStore.getPosts()
    postStore.isCreated = false
    postStore.isUpdated = false
    postStore.isDeleted = false
    postStore.isSorted = false
  }
  if (authStore.isLogin) {
    authStore.utilsStore.handleSuccess('Login Successfully.')
    authStore.isLogin = false
  }
})

const userId = authStore.userId || localStorage.getItem('userId')
const role = authStore.role || localStorage.getItem('role')

const logout = () => {
  authStore.logout()
}

const createNewPost = () => {
  router.push('posts/create')
}

const getPostById = async (postId) => {
  router.push('posts/' + postId)
}

const editPost = (postId) => {
  router.push('posts/' + postId + '/edit')
}

const deletePost = async (postId) => {
  await postStore.deletePost(postId)
}
</script>

<style scoped>
.grid {
  width: 100%;
}
</style>
