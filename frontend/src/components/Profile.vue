<template>
    <div class="p-4">

        <div class="text-3xl text-center font-bold mb-4">
            My Profile
        </div>

        <p>            
            {{ authStore.user?.name }}
        </p>
        <p>            
            {{ authStore.user?.email }}
        </p>

       
    </div>
</template>

<script>
import { useAuthStore } from '../stores/auth'

export default {
    data(){
        return {
        authStore: null
        }
    },
    created(){
        this.authStore = useAuthStore()
    }

    
}

</script>