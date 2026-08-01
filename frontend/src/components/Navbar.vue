<template>    
    <nav class="flex-1 border-b shadow-sm bg-white ">
        <div class="text-3xl items-center font-bold p-4"
            >Task Manager
        </div>
         <router-link to="/" 
        >
            Dashboard
            
        </router-link>

        <router-link to="/login" v-if="!authStore.user"
        >
            Login
        </router-link>

        <button v-else @click.prevent="handleLogout"
            type="button"
            class="p-2"
        >
            Logout
        </button>

        <router-link to="/profile" v-if="authStore.user"
        >
            My Profile

        </router-link>

        <router-link to="/shared" v-if="authStore.user"
        >
            Shared Tasks

        </router-link>
   

    </nav>
    
    <img
        v-if="authStore.hasAvatar && authStore.user"
        :src="'http://localhost:3000/users/' + authStore.user._id + '/avatar?v=' + authStore.avatarVersion"
        alt="Profile Avatar"
        class="w-32 h-32 rounded-full object-cover"
        @error="authStore.hasAvatar = false"
    />
</template>



<script>
import { useAuthStore } from '../stores/auth'

export default{

    data(){
        return {
            authStore: null
        }
    },

    created() {
        this.authStore = useAuthStore()
    },

    methods:{
        async handleLogout(){
            const authStore = useAuthStore()
            authStore.logout()
            this.$router.push('/login')
            }
    }
}

</script>