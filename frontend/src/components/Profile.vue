<template>
    <div class="p-4">

        <div class="text-3xl text-center font-bold mb-4">
            My Profile
        </div>

        <img
            v-if="authStore.hasAvatar"
            :src="'http://localhost:3000/users/' + authStore.user._id + '/avatar?v=' + authStore.avatarVersion"
            alt="Profile Avatar"
            class="w-32 h-32 rounded-full object-cover"
            @error="authStore.hasAvatar = false"
        />

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

        <input 
            type="file" 
            @change="handleFileSelect" 
            class="border p-2" 
        />

        <button @click="uploadAvatar" 
            type="button" 
            class="border p-2"
        >
            Upload

        </button>

        <button
            @click="removeAvatar"
            type="button"
            class="border p-2"
        >
            Remove Avatar
        </button>

        <button
            @click="logoutAllDevices"
            type="button"
            class="border p-2"
        >
            Logout All Devices
        </button>

        <button
            @click="deleteAccount"
            type="button"
            class="border p-2"
        >
            Delete Account
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
            newPassword: '',
            selectedFile: null    
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
        handleFileSelect(event) {
            this.selectedFile = event.target.files[0]
        },
        async uploadAvatar() {
            try {
                const formData = new FormData()
                formData.append('avatar', this.selectedFile)

                await api.post('/users/me/avatar', formData)

                const notificationStore = useNotificationStore()
                notificationStore.show('Avatar uploaded successfully!')
                this.authStore.hasAvatar = true
                this.authStore.avatarVersion = Date.now()
            } catch (error) {
                const notificationStore = useNotificationStore()
                notificationStore.show('Failed to upload avatar', 'error')
            }
        },
        async removeAvatar() {
            try {
                await api.delete('/users/me/avatar')

                this.authStore.hasAvatar = false

                const notificationStore = useNotificationStore()
                notificationStore.show('Avatar removed successfully!')
            } catch (error) {
                const notificationStore = useNotificationStore()
                notificationStore.show('Failed to remove avatar', 'error')
            }
        },
        async logoutAllDevices() {
            try {
                await api.post('/users/logoutAll')

                const notificationStore = useNotificationStore()
                notificationStore.show('Logged out of all devices successfully!')

                this.authStore.logout()
                this.$router.push('/login')
            } catch (error) {
                const notificationStore = useNotificationStore()
                notificationStore.show('Failed to log out of all devices', 'error')
            }
        },
        async deleteAccount() {
            const confirmed = confirm('Are you sure?')

            if (!confirmed) {
                return
            }

            try {
                await api.delete('/users/me')

                const notificationStore = useNotificationStore()
                notificationStore.show('Account deleted successfully!')

                this.authStore.logout()
                this.$router.push('/login')
            } catch (error) {
                const notificationStore = useNotificationStore()
                notificationStore.show('Failed to delete account', 'error')
            }
        }
    },

    created(){
        this.authStore = useAuthStore()
        this.editedName = this.authStore.user.name
        this.editedEmail = this.authStore.user.email
    }

    
}

</script>