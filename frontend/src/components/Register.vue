<template>
    <div class="register-container">
        <h2>Registro</h2>
        <form @submit.prevent="registerUser" class="register-form">
            <div class="form-group">
                <label for="name">Nombre:</label>
                <input 
                  id="name" 
                  type="text" 
                  v-model="name" 
                  required 
                  placeholder="Introduce tu nombre" 
                />
            </div>
            <div class="form-group">
                <label for="email">Email:</label>
                <input 
                  id="email" 
                  type="email" 
                  v-model="email" 
                  required 
                  placeholder="Introduce tu email" 
                />
            </div>
            <div class="form-group">
                <label for="password">Contraseña:</label>
                <input 
                  id="password" 
                  type="password" 
                  v-model="password" 
                  required 
                  placeholder="Introduce tu contraseña" 
                />
            </div>
            
            <button type="submit" class="register-button">Registrarse</button>
        </form>
    </div>
</template>

<script>
import axios from '../axios';

export default {
    name: 'RegisterUser',
    data() {
        return {
            name: '',
            email: '',
            password: '',
        };
    },
    methods: {
        async registerUser() {
            try {
                const response = await axios.post('/register', {
                    name: this.name,
                    email: this.email,
                    password: this.password,
                });
                localStorage.setItem('token', response.data.token);
                this.$router.push('/login');
            } catch (error) {
                console.error('Error de registro: ', error);
            }
        }
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

.register-container {
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

.register-form {
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

.register-button {
    padding: 0.75rem;
    font-size: 1rem;
    background-color: #1abc9c;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.register-button:hover {
    background-color: #16a085;
}

.register-button:active {
    background-color: #149174;
}

@media (max-width: 768px) {
    .register-container {
        margin: 50px 1rem;
    }

    h2 {
        font-size: 1.5rem;
    }

    .register-button {
        font-size: 0.9rem;
    }
}
</style>
