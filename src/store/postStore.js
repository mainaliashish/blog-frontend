import { defineStore } from 'pinia'
import router from '@/router'
import { useAuthStore } from './authStore'
import { useUtilsStore } from './utilsStore'
import config from './config.json'
import { useCategoryStore } from './categoryStore'

export const usePostStore = defineStore('post', {
  state: () => ({
    networkRequest: false,
    authStore: useAuthStore(),
    utilsStore: useUtilsStore(),
    categoryStore: useCategoryStore(),
    posts: [],
    currentPost: {},
    post: {
      title: '',
      content: '',
      category_id: '',
      author_id: '',
      publication_date: '',
    },
    errors: {
      title: '',
      content: '',
      category: '',
    },
    isCreated: false,
    isUpdated: false,
    isDeleted: false,
    isSorted: false,
    sortOrder: 'desc',
    filteredPosts: [],
  }),
  getters: {
    postURL: () => config.api.baseUrl + 'posts',
    sortedPosts: (state) =>
      state.utilsStore.sortedData(state.filteredPosts, state.sortKey, state.sortOrder),
  },
  actions: {
    async getPosts() {
      this.networkRequest = true
      try {
        const response = await fetch(this.postURL)
        const serverResponse = await response.json()
        if (serverResponse.success) {
          this.posts = serverResponse.data
          this.filteredPosts = serverResponse.data
        } else {
          this.utilsStore.handleError(serverResponse.data)
        }
      } catch (error) {
        console.log(error)
        this.utilsStore.handleError('Something went wrong, please try again.')
      } finally {
        this.networkRequest = false
      }
    },

    async getPostById(postId) {
      this.networkRequest = true
      try {
        const singlePostUrl = this.postURL + '/' + postId
        const response = await fetch(singlePostUrl)
        const serverResponse = await response.json()
        // console.log(serverResponse.data)
        if (serverResponse.success) {
          this.storeCurrentPost(serverResponse.data)
        } else {
          this.utilsStore.handleError(serverResponse.message)
        }
      } catch (error) {
        console.log(error)
        this.utilsStore.handleError('Something went wrong, please try again.')
      } finally {
        this.networkRequest = false
      }
    },
    async addPost() {
      this.networkRequest = true
      const data = {
        title: this.post.title,
        content: this.post.content,
        category_id: this.post.category,
        author_id: parseInt(this.authStore.userId || localStorage.getItem('userId')),
        publication_date: this.utilsStore.getFormattedDate(),
      }
      const addPostUrl = this.postURL
      try {
        const response = await fetch(addPostUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.authStore.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
        const serverResponse = await response.json()
        if (serverResponse.success) {
          this.isCreated = true
          await router.replace('/')
        } else {
          this.utilsStore.handleError('Failed to add new post.')
        }
      } catch (error) {
        console.log(error)
        this.utilsStore.handleError('Something went wrong, please try again.')
      } finally {
        this.networkRequest = false
      }
    },
    async updatePost(postId) {
      this.networkRequest = true
      const category = this.categoryStore.categories.find(
        (cat) => cat.name === this.currentPost.category,
      )
      this.currentPost.category = category.id
      const data = {
        title: this.currentPost.title,
        content: this.currentPost.content,
        category_id: this.currentPost.category,
        author_id: parseInt(this.authStore.userId || localStorage.getItem('userId')),
        publication_date: this.utilsStore.getFormattedDate(),
      }
      const singlePostUrl = this.postURL + '/' + postId
      try {
        const response = await fetch(singlePostUrl, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${this.authStore.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
        const serverResponse = await response.json()
        if (response.status == 200 && serverResponse) {
          this.isUpdated = true
          router.push('/')
        } else {
          this.utilsStore.handleError('Error updating post, please try again.')
        }
      } catch (error) {
        console.log(error)
        this.utilsStore.handleError('Error updating post.')
      } finally {
        this.networkRequest = false
      }
    },
    async deletePost(postId) {
      this.networkRequest = true
      const singlePostUrl = this.postURL + '/' + postId
      try {
        const response = await fetch(singlePostUrl, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.authStore.token}`,
          },
        })
        const serverResponse = await response.json()
        if (serverResponse.success) {
          this.isDeleted = true
          this.utilsStore.handleSuccess('Post deleted successfully.')
        } else {
          this.utilsStore.handleError(serverResponse.message)
        }
      } catch (error) {
        console.log(error)
        this.utilsStore.handleError('Error deleting Post.')
      } finally {
        this.networkRequest = false
      }
    },
    storeCurrentPost(data) {
      this.currentPost = {
        id: data.id,
        title: data.title,
        content: data.content,
        category: data.category.name,
        author: data.author.name,
        author_id: data.author.id,
        publication_date: data.publication_date,
      }
    },

    sortByDate(sortOrder) {
      this.sortKey = 'publication_date'
      this.sortOrder = sortOrder
      this.filteredPosts = this.utilsStore.sortedData(this.filteredPosts, this.sortOrder)
    },

    resetCurrentPost() {
      this.currentPost = {
        id: '',
        title: '',
        content: '',
        category: '',
        author: '',
        publication_date: '',
      }
    },
  },
})
