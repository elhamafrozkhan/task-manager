<template>
    <input 
        type="checkbox"
        v-model="task.completed"
        @change="$emit('toggle-complete', task)"  
    />
        {{ task.description }}

        <TaskBadges :task="task" />

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
    emits: ['toggle-complete' , 'delete-task'],

    components: { 
        TaskBadges 
    }

}


</script>