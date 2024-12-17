import { defineStore } from 'pinia'
import { toast } from 'vue3-toastify'

export const useUtilsStore = defineStore('utilsStore', {
  state: () => ({}),
  getters: {},
  actions: {
    truncateSentence(sentence, limit) {
      if (sentence)
        return sentence.length > limit ? sentence.substring(0, limit) + '....' : sentence
      return null
    },
    handleSuccess(message) {
      toast.success(message, {
        autoClose: 1000,
        transition: 'slide',
        position: toast.POSITION.TOP_RIGHT,
      })
    },
    handleInfo(message) {
      toast.info(message, {
        autoClose: 1000,
        transition: 'slide',
        position: toast.POSITION.TOP_RIGHT,
      })
    },
    handleError(message) {
      toast.error(message, {
        autoClose: 1000,
        transition: 'slide',
        position: toast.POSITION.TOP_RIGHT,
      })
    },

    getFormattedDate() {
      const today = new Date()
      const formattedDate = today.toISOString().split('T')[0]
      return formattedDate
    },

    sortedData: (data, sortOrder) => {
      return [...data].sort((a, b) => {
        const dateA = new Date(a.publication_date)
        const dateB = new Date(b.publication_date)

        if (sortOrder === 'asc') {
          return dateA - dateB // Ascending order
        } else {
          return dateB - dateA // Descending order
        }
      })
    },
  },
})
