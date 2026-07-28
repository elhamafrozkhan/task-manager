import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('notification', {

    state: () => ({
        message: null
    }),
    
    actions: {
        show(message) {
            this.message = message
        }
    }

})