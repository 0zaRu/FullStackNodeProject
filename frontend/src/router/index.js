import { createRouter, createWebHistory } from 'vue-router';
import Register from '../components/Register.vue';
import Login from '../components/Login.vue';
import Users from '../components/Users.vue';

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/register', component: Register, name: 'RegisterUser' },
    { path: '/login', component: Login, name: 'LoginUser' },
    { path: '/main', component: Users, name: 'mainUser', meta: { requiresAuth: true } },
    { path: '/users', redirect: '/main' },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;