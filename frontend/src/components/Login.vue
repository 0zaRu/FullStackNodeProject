<template>
    <div>
        <h2>Iniciar Sesión</h2>
        <form @submit.prevent="loginUser">
            <div>
                <label>Nombre de usuario:</label>
                <input type="text" v-model="user" required placeholder="Email o usuario." />
            </div>
            <div>
                <label>Contraseña:</label>
                <input type="password" v-model="password" required />
            </div>
            
            <button type="submit">Iniciar Sesión</button>

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