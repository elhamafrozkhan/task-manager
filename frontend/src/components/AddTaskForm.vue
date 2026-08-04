<template>
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

            <input 
                type="text" 
                v-model="newTaskTags" 
                placeholder="tags, comma, separated" 
                class="border p-2" 
            />
            
            <button 
                type="submit"
                class="border p-2"
            >
                Add
            </button>

        </div>
    </form>

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