<template>
    <div class="min-h-screen flex items-center justify-center bg-slate-50">

        <div class="max-w-md w-full mx-auto bg-white rounded-lg shadow-md p-6">

            <div class="text-3xl text-center font-bold mb-4">
                Create Account
            </div>

            <p class="text-center text-slate-600 mb-6">
                Sign up for a new TaskManager account
            </p>

            <form @submit.prevent="handleRegister">

                <div class="mb-3">
                    <label class="block mb-1 text-sm font-medium">
                        Name
                    </label>

                    <input
                        type="text"
                        v-model="name"
                        class="border p-2 w-full rounded"
                    />
                </div>

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
                    Register
                </button>

                <p class="mt-4 text-center">
                    Already have an account?
                    <router-link
                        to="/login"
                        class="underline text-indigo-600"
                    >
                        Log in
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
            name: '',
            email: '',
            password: ''
        }
    },

    methods: {
        async handleRegister() {

            const notificationStore = useNotificationStore()

            try {
                const response = await api.post('/users', {
                    name: this.name,
                    email: this.email,
                    password: this.password
                })

                useAuthStore().login(
                    response.data.user,
                    response.data.token
                )

                notificationStore.show('Registration successful!')

                console.log('Registration Successful')
                console.log(response.data)

                this.$router.push('/')
            }
            catch (error) {

                notificationStore.show('Registration failed — check your details', 'error')

                console.log('Registration Failed')
                console.log(error)
            }
        }
    }
}
</script>