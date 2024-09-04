import { createApp } from 'vue'; // Importa createApp en lugar de Vue de 'vue'
import App from './App.vue';
import router from './router';
import axios from 'axios';
import VueAxios from 'vue-axios';

const app = createApp(App);

// Configuración global de Axios
app.use(VueAxios, axios);
// Middleware global para protección de rutas
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token') ? true : false;
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else {
  
    next();
  }
});

app.use(router); // Usa el router
app.mount('#app'); // Monta la aplicación en el elemento con id 'app'