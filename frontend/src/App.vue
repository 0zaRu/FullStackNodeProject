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
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

body {
  font-family: 'Roboto', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f4f4f9;
  color: #2c3e50;
}

.navbar {
  background-color: #2c3e50;
  padding: 1rem;
  color: #ecf0f1;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.nav-logo {
  font-size: 1.7rem;
  font-weight: bold;
  color: #ecf0f1;
  text-decoration: none;
  transition: color 0.3s ease;
}

.nav-logo:hover {
  color: #1abc9c;
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 1.5rem;
}

.nav-links a {
  color: #ecf0f1;
  text-decoration: none;
  font-size: 1.1rem;
  transition: color 0.3s ease;
}

.nav-links a:hover {
  color: #1abc9c;
}

.content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .nav-links {
    flex-direction: column;
    gap: 1rem;
  }

  .nav-container {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
