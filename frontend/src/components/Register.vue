<template>
    <div class="p-4">

        <div class="text-3xl text-center font-bold mb-4">
            Create Account
        </div>

        <p class="text-center mb-4">
            Sign up for a new TaskManager account
        </p>

        <form @submit.prevent="handleRegister">

            <div class="mb-3">
                <label>Name</label>

                <input
                    type="text"
                    v-model="name"
                    class="border p-2"
                />
            </div>

            <div class="mb-3">
                <label>Email</label>

                <input
                    type="email"
                    v-model="email"
                    class="border p-2"
                />
            </div>

            <div class="mb-3">
                <label>Password</label>

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
                Register
            </button>

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