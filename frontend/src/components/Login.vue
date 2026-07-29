<template>
    <div class="p-4">

        <div class="text-3xl text-center font-bold mb-4">
            Welcome Back
        </div>
        <p class="text-center"> 
            Sign in to your TaskManager account
        </p>


        <form @submit.prevent="handleLogin">

            <div class="mb-3">

                <label>
                    Email
                </label>

                <input 
                    type="email"
                    v-model="email"
                    class="border p-2"
                />

            </div>

            <div class="mb-3">

                <label>
                    Password
                </label>

                <input 
                    type="password"
                    v-model="password"
                    class="border p-2"
                />

            </div>

            <button 
                type="submit"
                class="border p-2"
            >
                Login
            </button>

            <p class="mt-4 text-center">
                Don't have an account?
                <router-link
                    to="/register"
                    class="underline"
                >
                    Sign up
                </router-link>
            </p>

        </form>

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