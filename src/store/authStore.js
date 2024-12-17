import { defineStore } from 'pinia'
import config from './config.json'
import { useUtilsStore } from './utilsStore'
import router from '@/router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    networkRequest: false,
    utilsStore: useUtilsStore(),
    loginData: {
      email: '',
      password: '',
    },
    registerData: {
      name: '',
      email: '',
      password: '',
      c_password: '',
    },
    isAdminUser: '',
    token: localStorage.getItem('authorizationToken') || null,
    userId: localStorage.getItem('userId') || null,
    userRole: localStorage.getItem('userRole') || null,
    isLogout: false,
    isLogin: false,
    validationError: false,
    validationErrors: [],
  }),
  getters: {
    loginURL: () => config.api.baseUrl + 'login',
    registerURL: () => config.api.baseUrl + 'register',
  },
  actions: {
    storeToken(token) {
      if (token) {
        this.token = token
        localStorage.setItem('authorizationToken', token)
      }
    },

    async storeUser(info) {
      if (info) {
        localStorage.setItem('userId', info.user_id)
        localStorage.setItem('name', info.name)
        localStorage.setItem('role', info.role)
      }
    },

    getToken() {
      return this.token
    },

    removeToken() {
      this.token = null
      this.userId = null
      this.name = null
      this.role = null
      localStorage.removeItem('authorizationToken')
      localStorage.removeItem('userId')
      localStorage.removeItem('name')
      localStorage.removeItem('role')
    },

    isAuthenticated() {
      return !!this.token
    },

    async register() {
      this.networkRequest = true
      const { name, email, password, c_password } = this.registerData

      try {
        if (password !== c_password) {
          throw new Error('Passwords do not match')
        }
        // Create a POST request to the server
        const serverResponse = await fetch(this.registerURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            password,
            c_password,
          }),
        })
        const response = await serverResponse.json()
        console.log(response)
        if (response && response.token) {
          this.storeToken(response.token)
          await this.storeUser(response.data)
          this.useUtilsStore.handleSuccess('Registration success..')
          console.log('Registration successful')
          router.push('/')
        } else {
          this.validationError = true
          this.validationErrors = response.data
          console.log(this.validationErrors)
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.networkRequest = false
      }
    },

    async login() {
      this.networkRequest = true
      const { email, password } = this.loginData
      try {
        const serverResponse = await fetch(this.loginURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        })
        const response = await serverResponse.json()
        // console.log(response)
        if (response.success) {
          if (response && response.data.token) {
            this.storeToken(response.data.token)
            this.storeUser(response.data)
          }
          this.isLogin = true
          router.push('/')
        } else {
          this.utilsStore.handleError('Username or Password do not match.')
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.networkRequest = false
      }
    },
    logout() {
      try {
        this.networkRequest = true
        this.removeToken()
        this.$reset()
        localStorage.clear()
        this.isLogout = true
        router.push('/login')
      } catch (error) {
        console.log(`Error signing out: ${error}.`)
      } finally {
        this.networkRequest = false
      }
    },
  },
})
