import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('notification', {

    state: () => ({
        message: null,
        type: null
    }),

    actions: {
        show(message, type = 'success') {
            this.message = message
            this.type = type

            setTimeout(() => {
                this.message = null
                this.type = null
            }, 3000)
        }
    }

})