<template>
    <div>
        <h2>Registro</h2>
        <form @submit.prevent="registerUser">
            <div>
                <label>Nombre:</label>
                <input type="text" v-model="name" required />
            </div>
            <div>
                <label>Email:</label>
                <input type="email" v-model="email" required />
            </div>
            <div>
                <label>Contraseña:</label>
                <input type="password" v-model="password" required />
            </div>
            
            <button type="submit">Registrarse</button>

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