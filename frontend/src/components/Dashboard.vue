<template>

    <div class="p-4">
        <div class="text-xl font-bold"
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
        > 
            All

        </button>

        <button @click="currentFilter = 'active'" 
            type="button" 
            class="border p-2"
        >
            Active
        </button>

        <button @click="currentFilter = 'completed'" 
            type="button" 
            class="border p-2"
        >   
            Completed

        </button>

    </div>

        <div v-for="task in filteredTasks" :key="task._id">

            <input 
                type="checkbox"
                v-model="task.completed"
                @change="toggleComplete(task)"  
            />
                {{ task.description }}
            <span
                :class="{
                    'bg-red-200 text-red-800 border p-2': task.priority === 'high',
                    'bg-yellow-200 text-yellow-800 border p-2': task.priority === 'medium',
                    'bg-green-200 text-green-800 border p-2': task.priority === 'low'
                }"
            >
                {{ task.priority }}

            </span>

            <button @click.prevent="deleteTask(task)"
                type="button"
                class="border p-2"
            >
                Delete

            </button>

        </div>

         <form @submit.prevent="addTask">

            <div class="mb-3">

                <label>
                   New Task
                </label>

                <input 
                    type="text"
                    v-model="newTaskDescription"
                    class="border p-2"
                />
                <select
                    v-model="newTaskPriority"
                    class="border p-2"
                >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
                <button 
                    type="submit"
                    class="border p-2"
                >
                    Add
                </button>

            </div>
         </form>

    </div>
             
</template>


<script>

import api from '../services/api'
import { useMessageStore } from '../stores/message'
import { useAuthStore } from '../stores/auth'

export default {

    data() {
        return {
            status: '',
            messageStore: null,
            authStore: null,
            newTaskDescription: '',
            newTaskPriority: 'medium',
            currentFilter: 'all',
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
        async addTask() {
            const response = await api.post('/tasks', { 
                description: this.newTaskDescription,
                priority: this.newTaskPriority
            })
            this.getTasks()
            this.newTaskDescription = ''
            this.newTaskPriority = 'medium'
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
            if (this.currentFilter === 'active') {
                return this.tasks.filter(task => !task.completed)
            }
            if (this.currentFilter === 'completed') {
                return this.tasks.filter(task => task.completed)
            }
            
            return this.tasks
            
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