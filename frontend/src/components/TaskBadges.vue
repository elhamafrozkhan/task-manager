<template>
    <span
        :class="{
            'bg-red-200 text-red-800 border p-2': task.priority === 'high',
            'bg-yellow-200 text-yellow-800 border p-2': task.priority === 'medium',
            'bg-green-200 text-green-800 border p-2': task.priority === 'low'
        }"
    >
        {{ task.priority }} 

    </span>

    <span
        class="border p-2"
        :class="{
            'bg-red-700 text-white': isOverdue(task)
        }"
    >
        {{ formatDate(task.dueDate) }}
    </span>
    <span
        :class="{
            'bg-indigo-200 text-indigo-800 border p-2': task.category === 'work',
            'bg-emerald-200 text-emerald-800 border p-2': task.category === 'personal',
            'bg-amber-200 text-amber-800 border p-2': task.category === 'shopping',
            'bg-purple-200 text-purple-800 border p-2': task.category === 'learning'
        }"
    >
        {{ task.category }} 

    </span>
</template>

<script>

export default{

    props: ['task'],

    methods: {
        formatDate(dateString) {
            if (!dateString) {
                return ''
            }

            const date = new Date(dateString)
            return date.toLocaleDateString()
        },
        isOverdue(task){
            if(!task.dueDate)   {
                return false
            }
            if(task.completed){
                return false
            }

            const date = new Date(task.dueDate)
            const now = new Date()
            return date < now
        }
    }
}


</script>