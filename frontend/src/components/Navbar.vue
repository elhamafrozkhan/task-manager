<template>    
    <nav class="sticky top-0 z-40 flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-slate-200 shadow-sm bg-white p-4">
        <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                </svg>
            </div>
            <span class="text-2xl font-bold">Task Manager</span>
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