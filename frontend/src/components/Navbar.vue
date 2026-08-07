<template>    
    <nav class="sticky top-0 z-40 flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-slate-200 shadow-sm bg-white p-4">
        <div class="flex-1 flex items-center justify-center md:justify-start gap-2">
            <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                </svg>
            </div>
            <span class="text-2xl font-bold">Task Manager</span>
        </div>

        <div class="flex flex-wrap items-center justify-center gap-4">
            <router-link to="/">
                Dashboard
            </router-link>

            <router-link to="/profile" v-if="authStore.user">
                My Profile
            </router-link>

            <router-link to="/shared" v-if="authStore.user">
                Shared Tasks
            </router-link>
        </div>

        <div class="flex-1 flex items-center justify-center md:justify-end gap-3">
            <template v-if="authStore.user">
                <div class="relative">
                    <div class="flex items-center gap-2 cursor-pointer bg-slate-100 hover:bg-slate-200 rounded-full pl-1 pr-4 py-1"
                        @click.prevent="isMenuOpen = !isMenuOpen">
                        <img
                            v-if="authStore.hasAvatar"
                            :src="apiUrl + '/users/' + authStore.user._id + '/avatar?v=' + authStore.avatarVersion"
                            alt="Profile Avatar"
                            class="w-10 h-10 rounded-full object-cover"
                            @error="authStore.hasAvatar = false"
                        />
                        <span class="text-sm font-medium">{{ authStore.user?.name }}</span>
                        <svg class="w-4 h-4 text-slate-400 transition-transform"
                            :class="{ 'rotate-180': isMenuOpen }"
                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                        </svg>
                    </div>
                    <div 
                        v-if="isMenuOpen"
                        class="absolute top-full text-center right-0 z-50 rounded-xl mt-2 w-64 p-6 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1),0_-4px_6px_-1px_rgba(0,0,0,0.1)] bg-white"
                    >
                        <img
                            v-if="authStore.hasAvatar"
                            :src="apiUrl + '/users/' + authStore.user._id + '/avatar?v=' + authStore.avatarVersion"
                            alt="Profile Avatar"
                            class="w-16 h-16 mb-1 mx-auto rounded-full object-cover"
                            @error="authStore.hasAvatar = false"
                        />

                        <p class="font-semibold text-lg">

                            {{ authStore.user?.name }}

                        </p>
                        <p class="text-sm mb-4 text-slate-500">

                            {{ authStore.user?.email }}

                        </p>

                        <button @click.prevent="handleLogout"
                            type="button"
                            class="px-4 py-2 w-full rounded-md flex items-center justify-center gap-2 border border-red-200 text-red-600 hover:bg-red-50"
                        >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.5 3H7.5a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6M9 12H21m0 0-3-3m3 3-3 3"/>
                            </svg>

                            Logout

                        </button>
                    </div>
                </div>
            </template>

            <router-link v-else to="/login">
                Login
            </router-link>
        </div>
    </nav>
    
</template>



<script>
import { useAuthStore } from '../stores/auth'

export default{

    data(){
        return {
            authStore: null,
            isMenuOpen: false,
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
            this.isMenuOpen = false
            this.$router.push('/login')
        }
    }
}

</script>