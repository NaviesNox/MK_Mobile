import { defineStore } from 'pinia'

const LOCAL_TOKEN = 'local-device'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || LOCAL_TOKEN,
    user: JSON.parse(localStorage.getItem('local-user') || 'null')
  }),
  actions: {
    async login(email, password) {
      if (!email || !password) throw new Error('Email dan password wajib diisi')
      this.token = LOCAL_TOKEN
      this.user = { email }
      localStorage.setItem('token', LOCAL_TOKEN)
      localStorage.setItem('local-user', JSON.stringify(this.user))
    },
    async register(email, fullName, password) {
      await this.login(email, password)
      this.user = { email, fullName }
      localStorage.setItem('local-user', JSON.stringify(this.user))
      return this.user
    },
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('local-user')
    }
  }
})
