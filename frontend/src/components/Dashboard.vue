<template>

    <div class="p-4">
        <div class="text-3xl text-center font-bold mb-4"
            >Dashboard
        </div>
        <p>            
            {{ authStore.user?.name }}
        </p>
        <div class="mb-3">

            <p class="mb-3">
                Total: {{ taskStats.total }}
                - Completed: {{ taskStats.completed }}
                - Pending: {{ taskStats.pending }}
                - Overdue: {{ taskStats.overdue }}
            </p>

            <button @click="currentFilter = 'all'" 
                type="button" 
                class="border p-2"
                :class="{
                    'bg-blue-500 text-white': currentFilter === 'all'
                }"
            > 
                All

            </button>

            <button @click="currentFilter = 'active'" 
                type="button" 
                class="border p-2"
                :class="{
                    'bg-blue-500 text-white': currentFilter === 'active'
                }"
            >
                Active
            </button>

            <button @click="currentFilter = 'completed'" 
                type="button" 
                class="border p-2"
                :class="{
                    'bg-blue-500 text-white': currentFilter === 'completed'
                }"
            >   
                Completed

            </button>

        </div>
        <input 
            type="text"
            v-model="searchQuery"
            placeholder="Search tasks..."
            class="border p-2" 
        />

        <select v-model="sortBy" class="border p-2">
            <option value="none">No Sorting</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
        </select>

        <select v-model="categoryFilter" class="border p-2">
            <option value="all">All Categories</option>
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="shopping">Shopping</option>
            <option value="learning">Learning</option>
        </select>

        <select v-model="priorityFilter" class="border p-2">
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
        </select>
        
        <div v-for="task in filteredTasks" :key="task._id">

            <TaskItem :task="task" 
                @toggle-complete="toggleComplete" 
                @delete-task="deleteTask"
                @update-task="updateTask"
                @task-shared="getTasks" 
            />

        </div>
        
        <AddTaskForm @add-task="handleAddTask" />      

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
            sortBy: 'none',
            categoryFilter: 'all',
            priorityFilter: 'all',
            tasks: []
        }
    },    

    methods: {
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
            if (this.searchQuery) {
                result = result.filter(task => task.description.toLowerCase().includes(this.searchQuery.toLowerCase()))
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