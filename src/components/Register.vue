<script setup>
import { ref, watch } from 'vue';
import { checkPassword, checkUsername, checkEmail } from '../services/registerServices.js';

// Valores de los inputs
const username = ref('');
const email = ref('');
const password = ref('');
const confirmPass = ref('');

// Clases dinamicas de los inputs
const inputUserClass = ref('form-control');
const inputEmailClass = ref('form-control');
const inputPassClass = ref('form-control');
const inputConfirmPassClass = ref('form-control mb-5');

// Flags de los inputs
const userIsValid = ref(false);
const emailIsValid = ref(false);
const passwordIsValid = ref(false);
const confirmPassIsValid = ref(false);

// Flags de las alertas
const flagAlert = ref(false);
const registerFlagError = ref(false)

// Funciones para validaciones de inputs del usuario y reacción de clases de los inputs
function testClassUsername(name) {
    if (name === '') { return };
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
    if (email === '') { return };
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
    if (pass === '' && undefined) { return };

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
    if (confirmPass.value === '' && password.value === '') { return }

    if (confirmPass.value === password.value) {
        inputConfirmPassClass.value = 'form-control mb-5 is-valid';
        confirmPassIsValid.value = true;
    } else {
        inputConfirmPassClass.value = 'form-control mb-5 is-invalid';
        confirmPassIsValid.value = false;
    }
}
// Función para resetar los valores en el registro
function resetValues() {
    // Restablecer clases de validación
    username.value = '';
    email.value = '';
    password.value = '';
    confirmPass.value = '';

    inputUserClass.value = 'form-control';
    inputEmailClass.value = 'form-control';
    inputPassClass.value = 'form-control';
    inputConfirmPassClass.value = 'form-control mb-5';

    document.getElementById('registerUser').reset()
}
// Watchers para hacer chequeos de los inputs del usuario
watch(username, (newVal) => testClassUsername(newVal));
watch(email, (newVal) => testClassEmail(newVal));
watch([password, confirmPass], (password) => testClassPassword(password));
watch([confirmPass, password], (confirmPass) => testClassConfirmPass(confirmPass));

// Variable para almacenar mensajes de error específicos
const errorMessage = ref('');

//Funcion fetch para registrar el usuario
async function registerUser(e) {
    e.preventDefault();
    errorMessage.value = '';

    if (!userIsValid.value) {
        errorMessage.value = 'El usuario no es válido';
    } else if (!emailIsValid.value) {
        errorMessage.value = 'El correo electrónico no es válido';
    } else if (!passwordIsValid.value) {
        errorMessage.value = 'La contraseña no es válida';
    } else if (!confirmPassIsValid.value) {
        errorMessage.value = 'La confirmación de contraseña no es válida';
    }

    if (errorMessage.value !== '') {
        // Establecer la bandera de error como verdadera si hay un error
        registerFlagError.value = true;
        return; 
    } else {
        registerFlagError.value = false;
    }

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
            registerFlagError.value = true;
            inputEmailClass.value = "form-control is-invalid"
            throw new Error('Error al registrar el usuario, email ya registrado');
        }

        const { token } = await response.json();

        if (token) {
            inputEmailClass.value = "form-control is-valid"
            registerFlagError.value = false;
            flagAlert.value = true;
            resetValues();

            // Cerrar el modal directamente tras 2 segundo
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
}
</script>

<template>
    <div class="borde">
        <form v-if="!flagAlert" class="w-75 mx-auto p-4 m-4" @submit="registerUser" id="registerUser">
            <h3 class="mb-4 py-2">Formulario de <span class="wordEnphasis">registro</span></h3>

            <!-- USERNAME -->
            <div class="mb-3">
                <label for="usernameFormControlInput1" class="form-label">Nombre de usuario</label>
                <input v-model="username" type="text" :class="inputUserClass" id="usernameFormControlInput1"
                    placeholder="username" autocomplete="username" required>
            </div>
            <!-- EMAIL -->
            <div class="mb-3">
                <label for="emailRegisterFormControlInput" class="form-label">Email</label>
                <input v-model="email" type="email" :class="inputEmailClass" id="emailRegisterFormControlInput"
                    placeholder="name@example.com" autocomplete="email" required>
            </div>

            <!-- PASSWORD -->
            <label for="registerPassword" class="form-label">Contraseña</label>
            <input v-model="password" type="password" :class="inputPassClass" id="registerPassword"
                aria-describedby="passwordHelpBlockRegister" placeholder="Password" autocomplete="current-password" required>

            <div id="passwordHelpBlock" class="form-text my-2">
                Tu contraseña debe de tener entre 8-20 carácteres y mínimo una mayúscula. No debe contener espacios,
                carácteres especiales o emojis.
            </div>
            <!-- CONFIRM PASSWORD -->
            <label for="confirmPassword" class="form-label ">Confirmar contraseña</label>
            <input v-model="confirmPass" type="password" id="confirmPassword" :class="inputConfirmPassClass"
                autocomplete="new-password" required>

            <!-- BUTTON -->
            <div class="">
                <input type="submit" class="btn btn-primary w-100" value="Registrar" />
            </div>

            <!-- ALERTA -->
            <p v-if="registerFlagError" class="mt-3 alert alert-danger">
                {{ errorMessage }}
            </p>

        </form>

        <!-- ALERTA -->
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