<template>

    <div 
        v-if = "notificationStore.message"
        class="fixed bottom-4 right-4 z-50 p-4 rounded-lg shadow-md bg-emerald-500 text-white"
        :class="{'bg-red-700 text-white': notificationStore.type === 'error'}"
        >
        {{ notificationStore.message }}

    </div>

</template>

<script>
import { useNotificationStore } from '../stores/notification';

export default{

    data(){
        return {
            notificationStore: null
        }
    },

    created() {
        this.notificationStore = useNotificationStore()
    }
}


</script>