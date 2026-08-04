<template>
    <div class="p-4">
        <div class="text-3xl text-center font-bold mb-4">
            Shared Tasks
        </div>

         <input
            type="text"
            v-model="searchQuery"
            placeholder="Search shared tasks..."
            class="border p-2 mb-3"
        />

        <div v-for="task in filteredTasks" :key="task._id" class="mb-3">

            <input 
                type="checkbox"
                v-model="task.completed"
                @change="toggleComplete(task)"  
            />
            <p class="mb-2">
                {{ task.description }}

            </p>

            <p class="mb-2">
                Shared by:
                {{ task.owner?.name || task.owner?.email  }}
            </p>

             <p class="mb-2">
                <TaskBadges :task="task" />

            </p>
        </div>
    </div>
</template>

<script>
import api from '../services/api'
import TaskBadges from './TaskBadges.vue'
import { useNotificationStore } from '../stores/notification.js'


export default {

    components: {
        TaskBadges
    },

    data() {
        return {
            tasks: [],
            searchQuery: ''
        }
    },

    methods: {
        async getSharedTasks() {
            try{
                const response = await api.get('/tasks/shared')
                this.tasks = response.data

            }catch (error) {
                const notificationStore = useNotificationStore()
                notificationStore.show('Failed to load shared tasks', 'error')
            }
        },

        async toggleComplete(task) {
            try{
                await api.patch('/tasks/' + task._id, {
                    completed: task.completed                
                })                
                this.getSharedTasks()
            }catch (error) {
                const notificationStore = useNotificationStore()
                notificationStore.show('Failed to update task', 'error')
            }
        }
    },
    computed: {
        filteredTasks() {
            let result = this.tasks

            if (this.searchQuery) {
                result = result.filter(task =>
                    task.description
                        .toLowerCase()
                        .includes(this.searchQuery.toLowerCase())
                )
            }

            return result
        }
    },

    mounted() {
        this.getSharedTasks()
    }
}
</script>