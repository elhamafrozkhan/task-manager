<template>

    <div 
        v-if = "notificationStore.message"
        class="fixed bottom-4 right-4 z-50 p-4 rounded-lg shadow-md"
        :class="notificationStore.type === 'error' ? 'bg-red-700 text-white' : 'bg-emerald-500 text-white'"
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