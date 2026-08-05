<template>    
    <nav class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b shadow-sm bg-white p-4">
        <div class="text-3xl font-bold"
            >Task Manager
        </div>

        <div class="flex flex-wrap items-center gap-4">
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

            <img
                v-if="authStore.hasAvatar && authStore.user"
                :src="apiUrl + '/users/' + authStore.user._id + '/avatar?v=' + authStore.avatarVersion"
                alt="Profile Avatar"
                class="w-10 h-10 rounded-full object-cover"
                @error="authStore.hasAvatar = false"
            />   

        </div>
    </nav>
    
</template>



<script>
import { useAuthStore } from '../stores/auth'

export default{

    data(){
        return {
            authStore: null,
            apiUrl: import.meta.env.VITE_API_URL
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