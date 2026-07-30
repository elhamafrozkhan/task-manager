<template>
    <input 
        type="checkbox"
        v-model="task.completed"
        @change="$emit('toggle-complete', task)"  
    />

    <div v-if="!isEditing">

        {{ task.description }}

    </div>

    <input
        v-if="isEditing"
        type="text"
        v-model="editedDescription"
        class="border p-2"
    />

    <select
        v-if="isEditing"
        v-model="editedPriority"
        class="border p-2"
    >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
    </select>

    <select
        v-if="isEditing"
        v-model="editedCategory"
        class="border p-2"
    >
        <option value="work">Work</option>
        <option value="personal">Personal</option>
        <option value="shopping">Shopping</option>
        <option value="learning">Learning</option>

    </select>

    <input 
        v-if="isEditing" 
        type="date" 
        v-model="editedDueDate" 
        class="border p-2" 
    />

        <TaskBadges :task="task" />

    <button v-if="!isEditing" @click="isEditing = true"
        type="button" 
        class="border p-2"
    >
        Edit

    </button>

    <button v-else @click="saveEdit" 
        type="button" 
        class="border p-2"
    >
        Save

    </button>


    <button @click.prevent="$emit('delete-task', task)"
        type="button"
        class="border p-2"
    >
        Delete

    </button>

</template>

<script>
import TaskBadges from './TaskBadges.vue'

export default{
    props: ['task'],
    emits: ['toggle-complete' , 'delete-task' , 'update-task'],

    components: { 
        TaskBadges 
    },

    data() {
        return {
            isEditing: false,
            editedDescription: this.task.description,
            editedPriority: this.task.priority,
            editedCategory: this.task.category,
            editedDueDate: this.task.dueDate ?
                this.task.dueDate.slice(0, 10) : ''
        }
    },

    methods: {
        saveEdit() {
            const updatedData = {   
                _id: this.task._id, 
                description: this.editedDescription,
                priority: this.editedPriority,
                category: this.editedCategory
            }

            if (this.editedDueDate) {
                updatedData.dueDate = this.editedDueDate
            }

            this.$emit('update-task', updatedData)
            this.isEditing = false
        }


    }
}


</script>