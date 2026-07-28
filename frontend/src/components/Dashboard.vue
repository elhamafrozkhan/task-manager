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

                <input 
                    type="date"
                    v-model="newTaskDueDate"
                    class="border p-2"
                />

                <select
                    v-model="newTaskCategory"
                    class="border p-2"
                >
                    <option value="work">Work</option>
                    <option value="personal">Personal</option>
                    <option value="shopping">Shopping</option>
                    <option value="learning">Learning</option>
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
import TaskItem from '../components/TaskItem.vue'

export default {

    components: { 
        TaskItem
    },

    data() {
        return {
            status: '',
            messageStore: null,
            authStore: null,
            newTaskDescription: '',
            newTaskPriority: 'medium',
            currentFilter: 'all',
            newTaskDueDate: '',
            newTaskCategory: 'personal',
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
        async addTask() {
            const taskData = {
                description: this.newTaskDescription,
                priority: this.newTaskPriority,
                category: this.newTaskCategory
            }

            if (this.newTaskDueDate) {
                taskData.dueDate = this.newTaskDueDate
            }

            const response = await api.post('/tasks', taskData)
            this.getTasks()
            this.newTaskDescription = ''
            this.newTaskPriority = 'medium'
            this.newTaskDueDate = ''
            this.newTaskCategory = 'personal'
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