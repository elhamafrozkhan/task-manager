<template>
    <div class="bg-white rounded-lg shadow-md p-4">
        <label class="block mb-3 font-semibold">
            Add New Task
        </label>

        <form @submit.prevent="addTask">

            <div class="flex flex-wrap gap-3">

            <input
                type="text"
                v-model="newTaskDescription"
                placeholder="Task description"
                class="border p-2 rounded flex-1"
            />
            <select
                v-model="newTaskPriority"
                class="border p-2 rounded"
            >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>

            <input
                type="date"
                v-model="newTaskDueDate"
                class="border p-2 rounded"
            />

            <select
                v-model="newTaskCategory"
                class="border p-2 rounded"
            >
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="shopping">Shopping</option>
                <option value="learning">Learning</option>
            </select>

            <input
                type="text"
                v-model="newTaskTags"
                placeholder="tags, comma, separated"
                class="border p-2 rounded"
            />
            
            <button
                type="submit"
                class="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
            >
                Add
            </button>

        </div>
        </form>
    </div>

</template>

<script>

export default{

    emits: ['add-task'],

    data(){
        return{
            newTaskDescription: '',
            newTaskPriority: 'medium',
            newTaskDueDate: '',
            newTaskCategory: 'personal',
            newTaskTags: ''
        }
    },
    methods: {
        
        addTask() {
            const taskData = {
                description: this.newTaskDescription,
                priority: this.newTaskPriority,
                category: this.newTaskCategory
            }

            if (this.newTaskDueDate) {
                taskData.dueDate = this.newTaskDueDate
            }

            const tags = this.newTaskTags 
                .split(',') 
                .map(tag => tag.trim()) 
                .filter(tag => tag)

            if (tags.length > 0) { 
                taskData.tags = tags 
            }

            this.$emit('add-task', taskData)

            this.newTaskDescription = ''
            this.newTaskPriority = 'medium'
            this.newTaskDueDate = ''
            this.newTaskCategory = 'personal'
            this.newTaskTags = ''
        }
    }

}


</script>