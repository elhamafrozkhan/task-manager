<template>

    <div v-if = "notificationStore.message"

        :class="{'bg-red-200 text-red-800': notificationStore.type === 'error'}"
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