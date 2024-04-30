<script setup>
import { ref } from 'vue';

//Stores
import { useUserStore } from '@/stores/useUserStore';

//Referencia de stores
const userStore = useUserStore();

const toggleError = ref(false);
const flagAlert = ref(false);
const errorDetail = ref('Error al actualizar')
const username = userStore.usernameRef

const newEmail = ref('');
const actualPass = ref('');
const newPass = ref('');

async function updateEmail(e) {
    e.preventDefault();
    toggleError.value = false;
    try {
        const data = { email: newEmail.value };
        console.log(data)

        const response = await fetch(`${import.meta.env.VITE_API_URL}users/update/email`, {
            method: 'PUT',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + userStore.userToken
            },
            body: JSON.stringify(data)
        })

        if (!response.ok) {
            toggleError.value = true;
            throw new Error('Error al actualizar email');
        }

        const respuesta = await response.json();
        flagAlert.value = true;

        setTimeout(() => {
            flagAlert.value = false;
        }, 2000)

    } catch (error) {
        flagAlert.value = false;
        toggleError.value = true;
        console.error("Error al actualizar email", error);
    }
}

async function updatePass(e) {
    e.preventDefault();
    toggleError.value = false;
    try {
        const data = { newPassword: newPass.value, reqOldPassword: actualPass.value };

        const response = await fetch(`${import.meta.env.VITE_API_URL}users/update/password`, {
            method: 'PUT',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + userStore.userToken
            },
            body: JSON.stringify(data)
        })

        if (!response.ok) {
            toggleError.value = true;
            throw new Error('Error al actualizar password');
        }

        const respuesta = await response.json();
        flagAlert.value = true;

        setTimeout(() => {
            flagAlert.value = false;
        }, 2000)

    } catch (error) {
        flagAlert.value = false;
        toggleError.value = true;
        console.error("Error al actualizar password", error);
    }
}

</script>

<template>
    <h1 class="my-4"> Página de usuario <span class="username">{{ username }}</span></h1>
    <div class="container-fluid d-flex flex-column">
        <div class="mx-auto widthForms mt-4">

            <div class="borderColor p-3">
                <h4 class="mb-3">Actualizar email</h4>
                <form class="d-flex flex-column mx-auto" @submit="updateEmail">
                    <label for="emailupdate" class="mb-2">Email</label>
                    <input v-model="newEmail" id="emailupdate" type="email" class="form-control mb-3"
                        autocomplete="email" required />
                    <button type="submit" class="btn btn-primary mb-3">Actualizar</button>
                </form>

            </div>

            <div class="mt-4 p-4 borderColor">
                <h4 class="mb-3">Actualizar contraseña</h4>
                <form class="d-flex flex-column mx-auto flex-wrap" @submit="updatePass">

                    <input type="text" class="form-control" autocomplete="username" hidden />

                    <label for="actualpass" class="mb-2">Contraseña actual</label>
                    <input v-model="actualPass" id="actualpass" type="password" class="form-control mb-3"
                        autocomplete="new-password" required />

                    <label for="newpass" class="mb-2">Nueva contraseña</label>
                    <input v-model="newPass" id="newpass" type="password" class="form-control mb-3"
                        autocomplete="new-password" minlength="8" maxlength="20" required />

                    <i id="passwordHelpBlock" class="mb-3">
                        Tu contraseña debe de tener entre 8-20 carácteres y mínimo una mayúscula. No debe contener
                        espacios,
                        carácteres especiales o emojis.
                    </i>

                    <button type="submit" class="btn btn-primary mb-3">Actualizar</button>
                </form>
            </div>

            <div v-if="toggleError">
                <p class="text-danger mt-3 fw-bold">{{ errorDetail }}</p>
            </div>
            <div v-if="flagAlert" class="alert alertSuccessColors mt-4 text-center mx-auto p-4 m-4" role="alert">
                Datos actualizados correctamente.
            </div>

        </div>



    </div>


</template>

<style scoped>
/* .spacer {
    height: 50px;
} */

.widthForms{
    max-width: 400px;
}
</style>