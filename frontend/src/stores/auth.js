import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {

    state: () => ({

        user: JSON.parse(localStorage.getItem('user')),
        token: localStorage.getItem('token'),
        hasAvatar: true,
        avatarVersion: Date.now()

    }),

    actions: {
        login(user, token) {
            
            this.user = user
            this.token = token

            localStorage.setItem('token', token)
            localStorage.setItem('user', JSON.stringify(user))
        },

        logout() {

            this.user = null
            this.token = null
            
            localStorage.removeItem('token')
            localStorage.removeItem('user')
        }


    }

})


