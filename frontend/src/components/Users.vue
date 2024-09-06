<template>
    <div class="user-list-container">
      <h2 class="title">Lista de Usuarios</h2>
      <div class="table-container">
        <table class="user-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user._id">
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  import axios from '../axios';
  
  export default {
    name: 'mainUser',
    data() {
      return { users: [] };
    },
    async created() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/main', {
          headers: {
            'x-auth-token': token,
          },
        });
        this.users = response.data;
      } catch (error) {
        console.error('Error al obtener la lista de usuarios: ', error);
      }
    },
  };
  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
  
  .user-list-container {
    max-width: 800px;
    margin: 50px auto;
    font-family: 'Roboto', sans-serif;
  }
  
  .title {
    text-align: center;
    font-size: 2rem;
    margin-bottom: 20px;
    color: #34495e;
  }
  
  .table-container {
    overflow-x: auto;
  }
  
  .user-table {
    width: 100%;
    border-collapse: collapse;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    overflow: hidden;
  }
  
  .user-table th, .user-table td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
  
  .user-table th {
    background-color: #2c3e50;
    color: white;
    font-weight: bold;
  }
  
  .user-table tr:hover {
    background-color: #f4f4f9;
  }
  
  .user-table td {
    color: #34495e;
  }
  
  @media (max-width: 768px) {
    .user-table {
      font-size: 0.9rem;
    }
  }
  </style>
  