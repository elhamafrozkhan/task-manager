<template>
    <input 
        type="checkbox"
        v-model="task.completed"
        @change="$emit('toggle-complete', task)"  
    />

    <div v-if="!isEditing">

        {{ task.description }}

    </div>

    <input
        v-if="isEditing"
        type="text"
        v-model="editedDescription"
        class="border p-2"
    />

    <select
        v-if="isEditing"
        v-model="editedPriority"
        class="border p-2"
    >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
    </select>

    <select
        v-if="isEditing"
        v-model="editedCategory"
        class="border p-2"
    >
        <option value="work">Work</option>
        <option value="personal">Personal</option>
        <option value="shopping">Shopping</option>
        <option value="learning">Learning</option>

    </select>

    <input 
        v-if="isEditing" 
        type="date" 
        v-model="editedDueDate" 
        class="border p-2" 
    />

    <input 
        v-if="isEditing" 
        type="text" 
        v-model="editedTags" 
        placeholder="tags, comma, separated"
        class="border p-2" 
    />

        <TaskBadges :task="task" />

    <button v-if="!isEditing" @click="isEditing = true"
        type="button" 
        class="border p-2"
    >
        Edit

    </button>

    <button v-else @click="saveEdit" 
        type="button" 
        class="border p-2"
    >
        Save

    </button>

    <button v-if="isEditing"
        @click="cancelEdit"
        type="button"
        class="border p-2"
    >
        Cancel
    </button>

    <button v-if="!isSharing" @click="isSharing = true" 
        type="button" 
        class="border p-2"
    >
        Share

    </button>

    <button v-if="!isUnsharing" @click="isUnsharing = true" 
        type="button" 
        class="border p-2"
    >
        Unshare

    </button>

    <input 
        v-if="isSharing" 
        type="email" 
        v-model="shareEmail" 
        class="border p-2" 
    />

    <button v-if="isSharing" @click="sendShare" 
        type="button" 
        class="border p-2"
    >
        Send

    </button>

    <input 
        v-if="isUnsharing" 
        type="email" 
        v-model="unshareEmail" 
        class="border p-2" 
    />

    <button v-if="isUnsharing" @click="sendUnshare()"  
        type="button" 
        class="border p-2"
    >
        Remove
    </button>

    <span v-if="task.sharedWith.length > 0">
        Shared with
        <span v-for="person in task.sharedWith" :key="person._id">
            {{ person.name }},

                <button @click.prevent="sendUnshare(person.email)"
                    type="button"
                    class="border p-2"
                >
                    Remove
                </button>
        </span>
    </span>

    <button @click.prevent="confirmDelete(task)"
        type="button"
        class="border p-2"
    >
        Delete
    </button>

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