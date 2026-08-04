<template>
    <div class="max-w-2xl mx-auto p-4">

        <div class="text-3xl font-bold mb-6">
            My Profile
        </div>

        <div class="bg-white rounded-lg shadow-md p-6 mb-4">
            <div class="flex items-center gap-4 mb-4">
                <img
                    v-if="authStore.hasAvatar"
                    :src="apiUrl + '/users/' + authStore.user._id + '/avatar?v=' + authStore.avatarVersion"
                    alt="Profile Avatar"
                    class="w-20 h-20 rounded-full object-cover border"
                    @error="authStore.hasAvatar = false"
                />

                <div class="flex-1">
                    <template v-if="!isEditingName">
                        <p class="text-lg font-semibold">{{ authStore.user?.name }}</p>
                        <p class="text-slate-500">{{ authStore.user?.email }}</p>
                    </template>

                    <div v-else class="flex flex-col gap-2">
                        <input
                            type="text"
                            v-model="editedName"
                            class="border p-2 rounded w-full"
                        />
                        <input
                            type="text"
                            v-model="editedEmail"
                            class="border p-2 rounded w-full"
                        />
                    </div>
                </div>

                <button v-if="!isEditingName" @click="isEditingName = true"
                    type="button"
                    class="text-sm px-3 py-1 rounded border hover:bg-slate-50"
                >
                    Edit
                </button>

                <button v-else @click="saveProfile"
                    type="button"
                    class="text-sm px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                >
                    Save
                </button>
            </div>

            <div class="flex items-center gap-2">
                <input
                    type="file"
                    @change="handleFileSelect"
                    class="text-sm flex-1 file:mr-3 file:px-3 file:py-1 file:rounded file:border-0 file:bg-indigo-50 file:text-indigo-700 file:text-sm hover:file:bg-indigo-100"
                />

                <button @click="uploadAvatar"
                    type="button"
                    class="text-sm px-3 py-1 rounded border hover:bg-slate-50"
                >
                    Upload
                </button>

                <button @click="removeAvatar"
                    type="button"
                    class="text-sm px-3 py-1 rounded border hover:bg-slate-50"
                >
                    Remove Avatar
                </button>
            </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6 mb-4">
            <div class="flex items-center gap-2">
                <input
                    v-if="isEditingPassword"
                    type="password"
                    v-model="newPassword"
                    placeholder="New password"
                    class="border p-2 rounded flex-1"
                />

                <button v-if="!isEditingPassword" @click="isEditingPassword = true"
                    type="button"
                    class="text-sm px-3 py-1 rounded border hover:bg-slate-50"
                >
                    Change Password
                </button>

                <button v-else @click="savePassword"
                    type="button"
                    class="text-sm px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                >
                    Save Password
                </button>
            </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6 mb-4">
            <button @click="logoutAllDevices"
                type="button"
                class="text-sm px-3 py-1 rounded border hover:bg-slate-50"
            >
                Logout All Devices
            </button>
        </div>

        <div class="bg-red-50 border border-red-200 rounded-lg p-6">
            <p class="text-sm text-red-700 mb-2">Danger zone — this action cannot be undone.</p>
            <button @click="deleteAccount"
                type="button"
                class="text-sm px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
            >
                Delete Account
            </button>
        </div>
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
            apiUrl: import.meta.env.VITE_API_URL,
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