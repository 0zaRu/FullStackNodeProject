<template>
    <div>
        <h2> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Lista de usuarios </h2>
        <ul>
            <table style="border-collapse: collapse; border: 1px solid black; border-radius: 5px; padding: 10px;">
                <thead>
                    <tr>
                        <th style="border: 1px solid black; padding: 5px;">Name</th>
                        <th style="border: 1px solid black; padding: 5px;">Email</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in users" :key="user._id" style="border: 1px solid black;">
                        <td style="border: 1px solid black; padding: 5px;">{{ user.name }}</td>
                        <td style="border: 1px solid black; padding: 5px;">{{ user.email }}</td>
                    </tr>
                </tbody>
            </table>
        </ul>
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
    }
}

</script>