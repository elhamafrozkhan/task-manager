<template>
    <div class="p-4">
        <div class="text-3xl text-center font-bold mb-4">
            Shared Tasks
        </div>

        <div v-for="task in tasks" :key="task._id" class="mb-3">

            <input 
                type="checkbox"
                v-model="task.completed"
                @change="toggleComplete(task)"  
            />
            <p>
                {{ task.description }}
            </p>

            <p>
                Shared by:
                {{ task.owner?.name || task.owner?.email  }}
            </p>
        </div>
    </div>
</template>

<script>
import api from '../services/api'

export default {
    data() {
        return {
            tasks: []
        }
    },

    methods: {
        async getSharedTasks() {
            const response = await api.get('/tasks/shared')
            this.tasks = response.data
        },

        async toggleComplete(task) {
            await api.patch('/tasks/' + task._id, {
                completed: task.completed                
            })
            

                
            this.getSharedTasks()
        }
    },

    mounted() {
        this.getSharedTasks()
    }
}
</script>