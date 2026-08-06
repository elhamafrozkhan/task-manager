<template>
    <div class="max-w-4xl mx-auto p-4">
        <div class="text-3xl font-bold mb-6">
            Shared Tasks
        </div>

        <div class="flex gap-3 mb-4">
            <input
                type="text"
                v-model="searchQuery"
                @keyup.enter="applySearch"
                placeholder="Search shared tasks..."
                class="border p-2 rounded flex-1"
            />

            <button
                type="button"
                @click="applySearch"
                class="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
            >
                Search
            </button>
        </div>

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
            searchQuery: '',
            appliedSearchQuery: ''
        }
    },

    methods: {
        applySearch() {
            this.appliedSearchQuery = this.searchQuery
        },
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

            if (this.appliedSearchQuery) {
                result = result.filter(task =>
                    task.description
                        .toLowerCase()
                        .includes(this.appliedSearchQuery.toLowerCase())
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