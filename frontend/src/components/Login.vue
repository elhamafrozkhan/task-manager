<template>
    <div class="min-h-screen flex items-center justify-center bg-slate-50">

        <div class="max-w-md w-full mx-auto bg-white rounded-lg shadow-md p-6">

            <div class="text-3xl text-center font-bold mb-4">
                Welcome Back
            </div>

            <p class="text-center text-slate-600 mb-6"> 
                Sign in to your TaskManager account
            </p>

            <form @submit.prevent="handleLogin">

                <div class="mb-3">
                    <label class="block mb-1 text-sm font-medium">
                        Email
                    </label>

                    <input 
                        type="email"
                        v-model="email"
                        class="border p-2 w-full rounded"
                    />
                </div>

                <div class="mb-3">
                    <label class="block mb-1 text-sm font-medium">
                        Password
                    </label>

                    <input 
                        type="password"
                        v-model="password"
                        class="border p-2 w-full rounded"
                    />
                </div>

                <button 
                    type="submit"
                    class="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
                >
                    Login
                </button>

                <p class="mt-4 text-center">
                    Don't have an account?
                    <router-link
                        to="/register"
                        class="underline text-indigo-600"
                    >
                        Sign up
                    </router-link>
                </p>
            </form>
        </div>
    </div>

</template>


<script>
import api from '../services/api'
import { useAuthStore } from '../stores/auth'
import { useNotificationStore } from '../stores/notification.js'

export default {
    data() {
        return {
            email: '',
            password: ''
        }
    },

    methods: {
        async handleLogin() {

            const notificationStore = useNotificationStore()

            try {
                const response = await api.post('/users/login', {

                    email: this.email,
                    password: this.password
                })
                useAuthStore().login(
                    response.data.user,
                    response.data.token

                )
                notificationStore.show('Login successful!')

                console.log('Login Successful')
                console.log(response.data)

                this.$router.push('/')
            }
            catch (error) {

                notificationStore.show('Invalid email or password', 'error')

                console.log('Login Failed')
                console.log(error)
            }

        }

    }
    

}
</script>