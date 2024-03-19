<script setup>
import { ref, watch } from 'vue';
import { checkPassword, checkUsername, checkEmail } from '../services/registerServices.js';

import { useAuthStore } from '@/stores/useAuthStore';
import { useUserStore } from '@/stores/useUserStore';

const authStore = useAuthStore();
const userStore = useUserStore();

const username = ref('');
const email = ref('');
const password = ref('');
const confirmPass = ref('');

const inputUserClass = ref('form-control');
const inputEmailClass = ref('form-control');
const inputPassClass = ref('form-control');
const inputConfirmPassClass = ref('form-control mb-5');
const registerFlagError = ref(false)

const userIsValid = ref(false);
const emailIsValid = ref(false);
const passwordIsValid = ref(false);
const confirmPassIsValid = ref(false);

const flagAlert = ref(false);

function testClassUsername(name) {
    const value = checkUsername(name);
    if (value) {
        inputUserClass.value = 'form-control is-valid'
        username.value = value;
        userIsValid.value = true;
    } else {
        inputUserClass.value = 'form-control is-invalid'
        userIsValid.value = false;
    }
}
function testClassEmail(email) {
    const value = checkEmail(email);
    if (value) {
        inputEmailClass.value = 'form-control is-valid'
        emailIsValid.value = true;
    } else {
        inputEmailClass.value = 'form-control is-invalid'
        emailIsValid.value = false;
    }
}
function testClassPassword(pass) {
    const value = checkPassword(pass);
    if (value) {
        inputPassClass.value = 'form-control is-valid'
        passwordIsValid.value = true;
    } else {
        inputPassClass.value = 'form-control is-invalid'
        passwordIsValid.value = false;
    }
}
function testClassConfirmPass() {
    if (confirmPass.value === password.value) {
        inputConfirmPassClass.value = 'form-control mb-5 is-valid';
        confirmPassIsValid.value = true;
    } else {
        inputConfirmPassClass.value = 'form-control mb-5 is-invalid';
        confirmPassIsValid.value = false;
    }
}

function resetValues(){
    username.value = '';
    email.value = '';
    password.value = '';
    confirmPass.value = '';
}

watch(username, (newVal) => testClassUsername(newVal));
watch(email, (newVal) => testClassEmail(newVal));
watch([password, confirmPass], (password) => testClassPassword(password));
watch([confirmPass, password], (confirmPass) => testClassConfirmPass(confirmPass));

async function registerUser(e) {
    e.preventDefault();

    if (userIsValid.value || emailIsValid.value || passwordIsValid.value || confirmPassIsValid.value) {

        try {
            
            const response = await fetch(`${import.meta.env.VITE_API_URL}users/register`, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: username.value, email: email.value, password: password.value })
            })

            if (!response.ok) {
                throw new Error('Error API');
            }

            const { token } = await response.json();

            if (token) {
                registerFlagError.value = false;
                //Flag de alerta
                flagAlert.value = true;

                resetValues();

                // Cerrar el modal directamente tras 1 segundo
                setTimeout(() => {
                    const registerModal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
                    registerModal.hide();
                    flagAlert.value = false;
                }, 2000)
            }
        } catch (error) {
            registerFlagError.value = true;
            console.error("Error Register", error);
        }
    } else {
        registerFlagError.value = true;
    }

}



</script>

<template>
    <div class="borde">
        <form v-if="!flagAlert" class="w-75 mx-auto p-4 m-4" @submit="registerUser">
            <h3 class="mb-4 py-2">Formulario de <span class="wordEnphasis">registro</span></h3>
            <!-- EMAIL -->
            <div class="mb-3">
                <label for="usernameFormControlInput1" class="form-label">Username</label>
                <input v-model="username" type="text" :class="inputUserClass" id="usernameFormControlInput1"
                    placeholder="username" autocomplete="username" required>
            </div>

            <div class="mb-3">
                <label for="emailRegisterFormControlInput" class="form-label">Email address</label>
                <input v-model="email" type="email" :class="inputEmailClass" id="emailRegisterFormControlInput"
                    placeholder="name@example.com" autocomplete="email" required>
            </div>

            <!-- PASSWORD -->
            <label for="registerPassword" class="form-label">Password</label>
            <input v-model="password" type="password" :class="inputPassClass" id="registerPassword"
                aria-describedby="passwordHelpBlockRegister" autocomplete="current-password" required>

            <div id="passwordHelpBlock" class="form-text my-2">
                Tu contraseña debe de tener entre 8-20 carácteres y mínimo una mayúscula. No debe contener espacios,
                carácteres especiales o emojis.
            </div>

            <label for="confirmPassword" class="form-label ">Confirm password</label>
            <input v-model="confirmPass" type="password" id="confirmPassword" :class="inputConfirmPassClass"
                autocomplete="new-password" required>

            <div class="">
                <input type="submit" class="btn btn-primary w-100" value="Registrar" />
            </div>

            <p v-if="registerFlagError" class="mt-3 text-danger">
                Debes rellenar todos los campos correctamente.
            </p>

        </form>

        <div v-if="flagAlert" class="alert alertSuccessColors mt-4 text-center w-75 mx-auto p-4 m-4" role="alert">
            ¡Registro completado con éxito! <br>
            Ahora puedes Acceder.
        </div>
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
</style>