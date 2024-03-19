<script setup>
import { ref } from 'vue'
import { checkPassword, checkEmail } from '../services/registerServices.js'
import { useAuthStore } from '@/stores/useAuthStore';
import { useUserStore } from '@/stores/useUserStore';

const authStore = useAuthStore();
const userStore = useUserStore();

const email = ref('');
const password = ref('');
const toggleCredentials = ref(false);

async function login(e) {
    e.preventDefault();
    const validEmail = checkEmail(email.value);
    const validPassword = checkPassword(password.value);

    if (!validEmail || !validPassword) {
        toggleCredentials.value = true;
    } else {
        
        try {
            const data = { email: email.value, password: password.value }

            const response = await fetch(`${import.meta.env.VITE_API_URL}users/login`, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })

            if (!response.ok) {
                throw new Error('Error API');
            }

            const { token } = await response.json();

            if (token) {
                authStore.flagToken = true;
                localStorage.setItem('token', token);
                userStore.setToken(token);
                userStore.getUserCredentials()

                // Cerrar el modal directamente
                const registerModal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
                if (registerModal) {
                    registerModal.hide();
                }


                email.value = '';
                password.value = '';
                toggleCredentials.value = false;

                

            } else {
                throw new Error('Token no encontrado en la respuesta.');
            }

        } catch (error) {
            toggleCredentials.value = true;
            console.error("Error Login", error);
        }


    }

}


</script>

<template>

    <div class="borde">
        <form class="w-75 mx-auto p-4 m-4" @submit="login">
            <h3 class="mb-4 py-2">Formulario de <span class="wordEnphasis">acceso</span></h3>
            <!-- EMAIL -->

            <div class="mb-3">
                <label for="emailLoginFormControlInput" class="form-label">Email address</label>
                <input v-model="email" type="email" class="form-control" id="emailLoginFormControlInput"
                    placeholder="name@example.com" autocomplete="email" required>
            </div>

            <!-- PASSWORD -->
            <label for="loginPassword" class="form-label">Password</label>
            <input v-model="password" type="password" id="loginPassword" class="form-control mb-5"
                aria-describedby="passwordHelpBlockLogin" autocomplete="current-password" required>


            <div class="">
                <input type="submit" class="btn btn-primary w-100" value="Acceder" />
            </div>

            
            <div v-if="toggleCredentials">
                <p class="text-danger mt-3 fw-bold">Credenciales incorrectas</p>
            </div>

        </form>
    </div>
</template>

<style scoped>
.form-text {
    color: var(--text-dark-1);
}

.borde {
    border: 1px solid var(--border-color);
    border-radius: 10px;

}

.wordEnphasis {
    color: var(--main-color);
}
</style>, checkPassword, checkEmail, checkEmail, checkPassworduseUserStore, useUserStore, 