<template>
    <div class="p-4">

        <div class="text-3xl text-center font-bold mb-4">
            My Profile
        </div>

        <p v-if="!isEditingName">

            {{ authStore.user?.name }}

        </p>
        <p v-if="!isEditingName">            
            {{ authStore.user?.email }}
        </p>

        <input
            v-if="isEditingName"
            type="text"
            v-model="editedName"
            class="border p-2"
        />

        <input
            v-if="isEditingName"
            type="text"
            v-model="editedEmail"
            class="border p-2"
        />

        <input
            v-if="isEditingPassword"
            type="password"
            v-model="newPassword"
            class="border p-2"
        />

        <button v-if="!isEditingName" @click="isEditingName = true"
            type="button" 
            class="border p-2"
        >
            Edit

        </button>

        <button v-else @click="saveProfile" 
            type="button" 
            class="border p-2"
        >
            Save

        </button>

        <button v-if="!isEditingPassword" @click="isEditingPassword = true"
            type="button" 
            class="border p-2"
        >
            Change Password

        </button>

        <button v-else @click="savePassword" 
            type="button" 
            class="border p-2"
        >
            Save Password

        </button>

       
    </div>
</template>

<script>
import api from '../services/api'
import { useAuthStore } from '../stores/auth'
import { useNotificationStore } from '../stores/notification';

export default {
    data(){
        return {
            authStore: null,
            isEditingName: false,
            isEditingPassword: false,
            editedName: '',
            editedEmail: '',
            newPassword: ''
        }
    },
    methods: {
        async saveProfile() {
            const response = await api.patch('/users/me', { name: this.editedName, email: this.editedEmail })
            this.authStore.login(response.data, this.authStore.token)
            this.isEditingName = false
        },
        async savePassword() {
            try {
                await api.patch('/users/me', { password: this.newPassword })
                const notificationStore = useNotificationStore()
                notificationStore.show('Password updated successfully!')
                this.newPassword = ''
                this.isEditingPassword = false
            } catch (error) {
                const notificationStore = useNotificationStore()
                notificationStore.show('Failed to update password', 'error')
            }
        },
    },

    created(){
        this.authStore = useAuthStore()
        this.editedName = this.authStore.user.name
        this.editedEmail = this.authStore.user.email
    }

    
}

</script>