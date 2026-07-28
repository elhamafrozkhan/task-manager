<template>

    <div v-if = "notificationStore.message">

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