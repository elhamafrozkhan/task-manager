<template>
    <span
        class="rounded-full px-3 py-1 text-xs font-medium"
        :class="{
            'bg-red-100 text-red-700': task.priority === 'high',
            'bg-amber-100 text-amber-700': task.priority === 'medium',
            'bg-emerald-100 text-emerald-700': task.priority === 'low'
        }"
    >
        {{ task.priority }}
    </span>

    <span
        v-if="task.dueDate"
        class="rounded-full px-3 py-1 text-xs font-medium"
        :class="isOverdue(task) ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600'"
    >
        {{ formatDate(task.dueDate) }}
    </span>

    <span
        class="rounded-full px-3 py-1 text-xs font-medium"
        :class="{
            'bg-indigo-100 text-indigo-700': task.category === 'work',
            'bg-emerald-100 text-emerald-700': task.category === 'personal',
            'bg-amber-100 text-amber-700': task.category === 'shopping',
            'bg-purple-100 text-purple-700': task.category === 'learning'
        }"
    >
        {{ task.category }}
    </span>

    <span
        v-for="tag in task.tags"
        :key="tag"
        class="rounded-full px-3 py-1 text-xs font-medium bg-slate-100 text-slate-600"
    >
        {{ tag }}
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