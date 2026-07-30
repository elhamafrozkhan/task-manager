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
        v-else
        type="text"
        v-model="editedDescription"
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
            editedDescription: this.task.description
        }
    },

    methods: {
        saveEdit() {
            this.$emit('update-task', { _id: this.task._id, description: this.editedDescription })
            this.isEditing = false
        }
    }


}


</script>