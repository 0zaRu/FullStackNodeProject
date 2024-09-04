<!-- src/App.vue -->

<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-container">
        <router-link to="/" class="nav-logo">MiApp</router-link>
        <ul class="nav-links">
          <li v-if="!isAuthenticated">
            <router-link to="/register">Registro</router-link>
          </li>
          <li v-if="!isAuthenticated">
            <router-link to="/login">Iniciar Sesión</router-link>
          </li>
          <li v-if="isAuthenticated">
            <router-link to="/users">Usuarios</router-link>
          </li>
          <li v-if="isAuthenticated">
            <a href="#" @click.prevent="logout">Cerrar Sesión</a>
          </li>
        </ul>
      </div>
    </nav>
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    isAuthenticated() {
      return localStorage.getItem('token') ? true : false;
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
/* Estilos básicos para la navegación y el contenido */

.navbar {
  background-color: #34495e;
  padding: 1rem;
  color: #ecf0f1;
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #ecf0f1;
  text-decoration: none;
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 1rem;
}

.nav-links a {
  color: #ecf0f1;
  text-decoration: none;
  font-size: 1rem;
}

.nav-links a:hover {
  text-decoration: underline;
}

.content {
  padding: 2rem;
}
</style>
