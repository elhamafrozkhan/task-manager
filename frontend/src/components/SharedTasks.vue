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
            tasks: [],
            searchQuery: ''
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