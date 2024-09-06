<template>
    <div class="login-container">
        <h2>Iniciar Sesión</h2>
        <form @submit.prevent="loginUser" class="login-form">
            <div class="form-group">
                <label for="username">Nombre de usuario:</label>
                <input 
                  id="username" 
                  type="text" 
                  v-model="user" 
                  required 
                  placeholder="Email o usuario" 
                />
            </div>
            <div class="form-group">
                <label for="password">Contraseña:</label>
                <input 
                  id="password" 
                  type="password" 
                  v-model="password" 
                  required 
                  placeholder="Contraseña"
                />
            </div>
            <button type="submit" class="login-button">Iniciar Sesión</button>
        </form>
    </div>
</template>

<script>
import axios from '../axios';

export default {
    name: 'LoginUser',
    data() {
        return {
            user: '',
            password: '',
        };
    },
    methods: {
        async loginUser() {
            try {
                const response = await axios.post('/login', {
                    name: this.user,
                    password: this.password,
                });
                localStorage.setItem('token', response.data.token);
                this.$router.push('/main');
            } catch (error) {
                console.error('Error de inicio de sesión: ', error);
            }
        }
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

.login-container {
    max-width: 400px;
    margin: 100px auto;
    background-color: #fff;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
    font-family: 'Roboto', sans-serif;
}

h2 {
    margin-bottom: 1.5rem;
    font-size: 1.8rem;
    color: #34495e;
}

.login-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    text-align: left;
}

label {
    font-size: 1rem;
    margin-bottom: 0.5rem;
    color: #34495e;
}

input {
    padding: 0.75rem;
    font-size: 1rem;
    border-radius: 4px;
    border: 1px solid #ccc;
    transition: border-color 0.3s ease;
}

input:focus {
    border-color: #1abc9c;
    outline: none;
}

.login-button {
    padding: 0.75rem;
    font-size: 1rem;
    background-color: #1abc9c;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.login-button:hover {
    background-color: #16a085;
}

.login-button:active {
    background-color: #149174;
}

@media (max-width: 768px) {
    .login-container {
        margin: 50px 1rem;
    }

    h2 {
        font-size: 1.5rem;
    }

    .login-button {
        font-size: 0.9rem;
    }
}
</style>
