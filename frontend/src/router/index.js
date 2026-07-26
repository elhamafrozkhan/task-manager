import {createRouter, createWebHistory} from 'vue-router';
import Dashboard from '../components/Dashboard.vue'
import Login from '../components/Login.vue'
import { useAuthStore } from '../stores/auth'
import Register from '../components/Register.vue'

const router = createRouter({
    history: createWebHistory(),
        routes: [
            {
            path: '/',
            component: Dashboard
            },
            {
            path: '/login',
            component: Login
            },
            {
            path: '/register',
            component: Register
            }
        ]
})
router.beforeEach((to, from) => {
    const authStore = useAuthStore()

    if (to.path === '/' && !authStore.token) {
        return '/login'
    }
})

export default router