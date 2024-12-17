import { defineStore } from 'pinia'
import config from './config.json'

export const useCategoryStore = defineStore('category', {
  state: () => ({
    networkRequest: false,
    categories: [],
  }),
  getters: {
    categoriesURL: () => config.api.baseUrl + 'categories',
  },
  actions: {
    async getCategories() {
      this.networkRequest = true
      try {
        const response = await fetch(this.categoriesURL)
        const serverResponse = await response.json()
        if (serverResponse.success) {
          this.categories = serverResponse.data
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
  },
})
