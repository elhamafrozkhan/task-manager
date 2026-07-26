import { defineStore } from 'pinia'

export const useMessageStore = defineStore('message', {

    state: () => ({
        text: 'Hello from Pinia!'
    })

})