import {createRouter, createWebHistory} from 'vue-router';
import Dashboard from '../components/Dashboard.vue';
import Login from '../components/Login.vue';
import { useAuthStore } from '../stores/auth';
import Register from '../components/Register.vue';
import Profile from '../components/Profile.vue';
import SharedTasks from '../components/SharedTasks.vue';
import NotFound from '../components/NotFound.vue';

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
            },
            {
            path: '/profile',
            component: Profile
            },
            {
            path: '/shared',
            component: SharedTasks
            },
            {
            path: '/:pathMatch(.*)*',
            component: NotFound
            }
            
        ]
})
router.beforeEach((to, from) => {
    const authStore = useAuthStore()

    const protectedPaths = ['/', '/profile', '/shared']

    if (protectedPaths.includes(to.path) && !authStore.token) {
        return '/login'
    }
})

export default router