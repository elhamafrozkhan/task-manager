<template>

    <div class="max-w-4xl mx-auto p-4">

        <div class="mb-6">
            <div class="text-3xl font-bold">
                Dashboard
            </div>
            <p class="text-slate-500">
                {{ authStore.user?.name }}
            </p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div class="bg-white rounded-lg shadow-sm p-4 text-center">
                <div class="text-xs text-slate-500 uppercase">Total</div>
                <div class="text-2xl font-bold">{{ taskStats.total }}</div>
            </div>
            <div class="bg-white rounded-lg shadow-sm p-4 text-center">
                <div class="text-xs text-slate-500 uppercase">Completed</div>
                <div class="text-2xl font-bold text-emerald-600">{{ taskStats.completed }}</div>
            </div>
            <div class="bg-white rounded-lg shadow-sm p-4 text-center">
                <div class="text-xs text-slate-500 uppercase">Pending</div>
                <div class="text-2xl font-bold text-amber-600">{{ taskStats.pending }}</div>
            </div>
            <div class="bg-white rounded-lg shadow-sm p-4 text-center">
                <div class="text-xs text-slate-500 uppercase">Overdue</div>
                <div class="text-2xl font-bold text-red-600">{{ taskStats.overdue }}</div>
            </div>
        </div>

        <div class="mb-6">
            <AddTaskForm @add-task="handleAddTask" />
        </div>

        <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div class="flex gap-2 mb-3">
                <button @click="currentFilter = 'all'"
                    type="button"
                    class="px-3 py-1 rounded text-sm border"
                    :class="currentFilter === 'all' ? 'bg-indigo-600 text-white border-indigo-600' : 'hover:bg-slate-50'"
                >
                    All
                </button>

                <button @click="currentFilter = 'active'"
                    type="button"
                    class="px-3 py-1 rounded text-sm border"
                    :class="currentFilter === 'active' ? 'bg-indigo-600 text-white border-indigo-600' : 'hover:bg-slate-50'"
                >
                    Active
                </button>

                <button @click="currentFilter = 'completed'"
                    type="button"
                    class="px-3 py-1 rounded text-sm border"
                    :class="currentFilter === 'completed' ? 'bg-indigo-600 text-white border-indigo-600' : 'hover:bg-slate-50'"
                >
                    Completed
                </button>
            </div>

            <div class="flex flex-wrap gap-3">
                <input
                    type="text"
                    v-model="searchQuery"
                    @keyup.enter="applySearch"
                    placeholder="Search tasks..."
                    class="border p-2 rounded flex-1"
                />

                <button
                    type="button"
                    @click="applySearch"
                    class="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                >
                    Search
                </button>

                <select v-model="sortBy" class="border p-2 rounded">
                    <option value="none">No Sorting</option>
                    <option value="dueDate">Due Date</option>
                    <option value="priority">Priority</option>
                </select>

                <select v-model="categoryFilter" class="border p-2 rounded">
                    <option value="all">All Categories</option>
                    <option value="work">Work</option>
                    <option value="personal">Personal</option>
                    <option value="shopping">Shopping</option>
                    <option value="learning">Learning</option>
                </select>

                <select v-model="priorityFilter" class="border p-2 rounded">
                    <option value="all">All Priorities</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>
        </div>

        <div>
            <TaskItem v-for="task in filteredTasks" :key="task._id"
                :task="task"
                @toggle-complete="toggleComplete"
                @delete-task="deleteTask"
                @update-task="updateTask"
                @task-shared="getTasks"
            />
        </div>

    </div>

</template>


<script>

import api from '../services/api'
import { useAuthStore } from '../stores/auth'
import TaskItem from '../components/TaskItem.vue'
import AddTaskForm from '../components/AddTaskForm.vue'
import { useNotificationStore } from '../stores/notification.js'

export default {

    components: { 
        TaskItem,
        AddTaskForm
    },

    data() {
        return {
            authStore: null,
            currentFilter: 'all',
            searchQuery: '',
            appliedSearchQuery: '',
            sortBy: 'none',
            categoryFilter: 'all',
            priorityFilter: 'all',
            tasks: []
        }
    },    

    methods: {
        applySearch() {
            this.appliedSearchQuery = this.searchQuery
        },
        async getTasks() {
            try {
                const response = await api.get('/tasks')
                this.tasks = response.data
            } catch (error) {
                const notificationStore = useNotificationStore()
                notificationStore.show('Failed to load tasks', 'error')
            }
        },
        async handleAddTask(taskData) {
            try{
                await api.post('/tasks', taskData)
                this.getTasks()
            
                const notificationStore = useNotificationStore()
                notificationStore.show('Task created successfully!')
            }catch (error) {
                const notificationStore = useNotificationStore()
                notificationStore.show('Failed to create a task', 'error')
            }
        },

        async toggleComplete(task) {
            try{
                await api.patch('/tasks/' + task._id, { completed: task.completed })
                this.getTasks()
                
                const notificationStore = useNotificationStore()
                notificationStore.show('Task updated!')
            }catch (error) {
                const notificationStore = useNotificationStore()
                notificationStore.show('Failed to update task', 'error')
            }
        },
        async updateTask(task) {
            try{
                const updates = {
                    description: task.description,
                    priority: task.priority,
                    category: task.category
                }

                if (task.dueDate) {
                    updates.dueDate = task.dueDate
                }

                if (task.tags) {
                    updates.tags = task.tags
                }
                await api.patch('/tasks/' + task._id, updates)
                this.getTasks()

                const notificationStore = useNotificationStore()
                notificationStore.show('Task updated!')
            }catch (error) {
                const notificationStore = useNotificationStore()
                notificationStore.show('Failed to update task', 'error')
            }

        },
        async deleteTask(task) {
            try {
                await api.delete('/tasks/' + task._id)
                this.getTasks()

                const notificationStore = useNotificationStore()
                notificationStore.show('Task deleted successfully!')
            } catch (error) {
                const notificationStore = useNotificationStore()
                notificationStore.show('Failed to delete task', 'error')
            }
        }
    },
    computed: {

        taskStats() {

            return {
                total: this.tasks.length,
                completed: this.tasks.filter(task => task.completed).length,
                pending: this.tasks.filter(task => !task.completed).length,
                overdue: this.tasks.filter(task => {
                    if (!task.dueDate) return false
                    if (task.completed) return false
                    return new Date(task.dueDate) < new Date()
                }).length
            }
        },

        filteredTasks() {
            let result = this.tasks

            if (this.currentFilter === 'active') {
                result = this.tasks.filter(task => !task.completed)
            }
            if (this.currentFilter === 'completed') {
                result = this.tasks.filter(task => task.completed)
            }
            if (this.appliedSearchQuery) {
                result = result.filter(task => task.description.toLowerCase().includes(this.appliedSearchQuery.toLowerCase()))
            }
            if (this.categoryFilter !== 'all') {
                result = result.filter(task => task.category === this.categoryFilter)
            }
            if (this.priorityFilter !== 'all') {
                result = result.filter(task => task.priority === this.priorityFilter)
            }
            if (this.sortBy === 'dueDate') {
                result = [...result].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
            }
            if (this.sortBy === 'priority') {
                const priorityOrder = { low: 1, medium: 2, high: 3 }
                result = [...result].sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority])
            }

            return result
            
        }
    },
    
    created() {
        this.authStore = useAuthStore()
    },

    mounted() {
        this.getTasks()
    }

}

</script>