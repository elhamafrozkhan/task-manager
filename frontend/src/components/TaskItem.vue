<template>
    <div class="bg-white rounded-lg shadow-md p-4 mb-3">

        <div class="flex items-start justify-between gap-3">
            <div class="flex items-start gap-3 flex-1">
                <input
                    type="checkbox"
                    v-model="task.completed"
                    @change="$emit('toggle-complete', task)"
                    class="mt-1 w-5 h-5 accent-indigo-600"
                />

                <div v-if="!isEditing" class="flex-1" :class="{ 'line-through text-slate-400': task.completed }">
                    {{ task.description }}
                </div>

                <div v-if="isEditing" class="flex-1 flex flex-col gap-2">
                    <input
                        type="text"
                        v-model="editedDescription"
                        class="border p-2 rounded w-full"
                    />

                    <div class="grid grid-cols-2 gap-2">
                        <select v-model="editedPriority" class="border p-2 rounded">
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>

                        <select v-model="editedCategory" class="border p-2 rounded">
                            <option value="work">Work</option>
                            <option value="personal">Personal</option>
                            <option value="shopping">Shopping</option>
                            <option value="learning">Learning</option>
                        </select>

                        <input
                            type="date"
                            v-model="editedDueDate"
                            class="border p-2 rounded"
                        />

                        <input
                            type="text"
                            v-model="editedTags"
                            placeholder="tags, comma, separated"
                            class="border p-2 rounded"
                        />
                    </div>
                </div>
            </div>

            <div class="flex items-center gap-2 shrink-0">
                <button v-if="!isEditing" @click="isEditing = true"
                    type="button"
                    class="text-sm px-3 py-1 rounded border hover:bg-slate-50"
                >
                    Edit
                </button>

                <button v-else @click="saveEdit"
                    type="button"
                    class="text-sm px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                >
                    Save
                </button>

                <button v-if="isEditing"
                    @click="cancelEdit"
                    type="button"
                    class="text-sm px-3 py-1 rounded border hover:bg-slate-50"
                >
                    Cancel
                </button>
            </div>
        </div>

        <div class="mt-3 flex flex-wrap gap-2">
            <TaskBadges :task="task" />
        </div>

        <div class="mt-3 pt-3 border-t flex flex-wrap items-center gap-2">
            <button v-if="!isSharing" @click="isSharing = true"
                type="button"
                class="text-sm px-3 py-1 rounded border hover:bg-slate-50"
            >
                Share
            </button>

            <button v-if="!isUnsharing" @click="isUnsharing = true"
                type="button"
                class="text-sm px-3 py-1 rounded border hover:bg-slate-50"
            >
                Unshare
            </button>

            <template v-if="isSharing">
                <input
                    type="email"
                    v-model="shareEmail"
                    placeholder="person@example.com"
                    class="border p-1 rounded text-sm"
                />
                <button @click="sendShare"
                    type="button"
                    class="text-sm px-3 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                >
                    Send
                </button>
            </template>

            <template v-if="isUnsharing">
                <input
                    type="email"
                    v-model="unshareEmail"
                    placeholder="person@example.com"
                    class="border p-1 rounded text-sm"
                />
                <button @click="sendUnshare()"
                    type="button"
                    class="text-sm px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                >
                    Remove
                </button>
            </template>

            <button @click.prevent="confirmDelete(task)"
                type="button"
                class="text-sm px-3 py-1 rounded text-red-600 hover:bg-red-50 ml-auto"
            >
                Delete
            </button>
        </div>

        <div v-if="task.sharedWith.length > 0" class="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-600">
            <span>Shared with:</span>
            <span v-for="person in task.sharedWith" :key="person._id"
                class="flex items-center gap-1 bg-slate-100 rounded-full pl-3 pr-1 py-1"
            >
                {{ person.name }}
                <button @click.prevent="sendUnshare(person.email)"
                    type="button"
                    class="w-5 h-5 rounded-full hover:bg-slate-300 text-slate-500"
                >
                    ×
                </button>
            </span>
        </div>

    </div>
</template>

<script>
import api from '../services/api'
import { useNotificationStore } from '../stores/notification'
import TaskBadges from './TaskBadges.vue'

export default{
    props: ['task'],
    emits: ['toggle-complete' , 'delete-task' , 'update-task', 'task-shared'],

    components: { 
        TaskBadges 
    },

    data() {
        return {
            isEditing: false,
            editedDescription: this.task.description,
            editedPriority: this.task.priority,
            editedCategory: this.task.category,
            editedDueDate: this.task.dueDate ?
                this.task.dueDate.slice(0, 10) : '',
            editedTags: this.task.tags ? this.task.tags.join(', ') : '',
            isSharing: false,
            shareEmail: '',
            isUnsharing: false,
            unshareEmail: ''
        }
    },

    methods: {
        saveEdit() {
            const updatedData = {   
                _id: this.task._id, 
                description: this.editedDescription,
                priority: this.editedPriority,
                category: this.editedCategory
            }

            if (this.editedDueDate) {
                updatedData.dueDate = this.editedDueDate
            }

            const tags = this.editedTags
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag)

            if (tags.length > 0) {
                updatedData.tags = tags
            }

            this.$emit('update-task', updatedData)
            this.isEditing = false
        },
        cancelEdit() {
            this.isEditing = false

            this.editedDescription = this.task.description
            this.editedPriority = this.task.priority
            this.editedCategory = this.task.category
            this.editedDueDate = this.task.dueDate ?
                this.task.dueDate.slice(0, 10) : ''
            this.editedTags = this.task.tags ?
                this.task.tags.join(', ') : ''
        },
        async sendShare() {
            try {
                await api.post('/tasks/' + this.task._id + '/share', { email: this.shareEmail })
                const notificationStore = useNotificationStore()
                notificationStore.show('Task shared successfully!')
                this.shareEmail = ''
                this.isSharing = false
                this.$emit('task-shared')
                
            } catch (error) {
                const notificationStore = useNotificationStore()
                notificationStore.show('Failed to share task', 'error')
            }
        },
        async sendUnshare(email = this.unshareEmail) {
            try {
                await api.delete('/tasks/' + this.task._id + '/unshare', {
                    data: { email }
                })
                const notificationStore = useNotificationStore()
                notificationStore.show('Task unshared successfully!')
                this.unshareEmail = ''
                this.isUnsharing = false
                this.$emit('task-shared')
            } catch (error) {
                const notificationStore = useNotificationStore()
                notificationStore.show('Failed to unshare task', 'error')
            }
        },
        confirmDelete(task) {
            const confirmed = confirm('Are you sure you want to delete this task?')

            if (!confirmed) {
                return
            }

            this.$emit('delete-task', task)
        }

    }
}


</script>