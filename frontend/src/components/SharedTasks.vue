<template>
    <div class="max-w-4xl mx-auto p-4">
        <div class="text-3xl font-bold mb-6">
            Shared Tasks
        </div>

        <input
            type="text"
            v-model="searchQuery"
            placeholder="Search shared tasks..."
            class="border p-2 rounded w-full mb-4"
        />

        <div v-for="task in filteredTasks" :key="task._id" class="bg-white rounded-lg shadow-md p-4 mb-3">
            <div class="flex items-start gap-3">
                <input
                    type="checkbox"
                    v-model="task.completed"
                    @change="toggleComplete(task)"
                    class="mt-1 w-5 h-5 accent-indigo-600"
                />

                <div class="flex-1">
                    <div :class="{ 'line-through text-slate-400': task.completed }">
                        {{ task.description }}
                    </div>

                    <p class="text-sm text-slate-500 mt-1">
                        Shared by: {{ task.owner?.name || task.owner?.email }}
                    </p>

                    <div class="flex flex-wrap gap-2 mt-2">
                        <TaskBadges :task="task" />
                    </div>
                </div>
            </div>
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