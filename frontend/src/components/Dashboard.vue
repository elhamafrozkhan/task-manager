<template>

    <div class="p-4">
        <div class="text-3xl text-center font-bold mb-4"
            >Dashboard
        </div>
        <p>
            {{ messageStore.text }}
        </p>
        <p>
            {{ status }}
        </p>
        <p>            
            {{ authStore.user?.name }}
        </p>
        <div class="mb-3">

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
            class="border p-2" 
        />
        
        <div v-for="task in filteredTasks" :key="task._id">

            <TaskItem :task="task" 
                @toggle-complete="toggleComplete" 
                @delete-task="deleteTask" 
            />

        </div>
        
        <AddTaskForm @add-task="handleAddTask" />
      

    </div>
             
</template>


<script>

import api from '../services/api'
import { useMessageStore } from '../stores/message'
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
            status: '',
            messageStore: null,
            authStore: null,
            currentFilter: 'all',
            searchQuery: '',
            tasks: []
        }
    },    

    methods: {
        async getHealth() {
            const response = await api.get('/health')
            this.status = response.data.status
        },

        async getTasks() {
            const response = await api.get('/tasks')
            this.tasks = response.data
        },
        async handleAddTask(taskData) {
            const notificationStore = useNotificationStore()

            const response = await api.post('/tasks', taskData)
            this.getTasks()
            
            notificationStore.show('Task created successfully!')
        },

        async toggleComplete(task) {
            await api.patch('/tasks/' + task._id, { completed: task.completed })
            this.getTasks()
        },
        async deleteTask(task) {
            await api.delete('/tasks/' + task._id)
            this.getTasks()
        },
    },
    computed: {
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

            return result
            
        }
    },
    
    created() {
        this.messageStore = useMessageStore()
        this.authStore = useAuthStore()
    },

    mounted() {
        this.getHealth()
        this.getTasks()
    }

}

</script>