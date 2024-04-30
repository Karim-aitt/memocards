<script setup>
import { onMounted,ref } from 'vue';
import { useUserStore } from '@/stores/useUserStore';

const userStore = useUserStore();
const usersData = ref([]);
const userIdSelected = ref(null);

const deleteMessage = ref('')
const flagAlert = ref(false);
const flagError = ref(false);

async function getUsers(){
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}users`, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Authorization': 'Bearer ' + userStore.userToken
                }
        })

        if (!response.ok) {
            throw new Error('Token invalido')
        }

        usersData.value = await response.json();
        
    } catch (error) {
        console.error('Error al obtener usuarios', error)
    }
}

async function deleteUser(){
    deleteMessage.value = '';
    flagAlert.value = false;
    flagError.value = false;

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}users/delete/?id=${userIdSelected.value}`, {
                method: 'DELETE',
                mode: 'cors',
                headers: {
                    'Authorization': 'Bearer ' + userStore.userToken
                }
        })

        if (!response.ok) {
            flagError.value = true;
            deleteMessage.value = 'Token invalido';
            throw new Error('Token invalido')
        }

        deleteMessage.value = await response.json();
        flagAlert.value = true;
        getUsers()

        setTimeout(() => {flagAlert.value = false}, 1000)
        
    } catch (error) {
        flagError.value = true;
        deleteMessage.value = 'Error al obtener usuarios';
        console.error('Error al obtener usuarios', error)
    }
}

onMounted(() => getUsers());

</script>

<template>

<h1 class="my-4"> Panel Admin</h1>

<div class="container-fluid d-flex ">

    <div>
        
    </div>

        <div class="widthForms mt-4">
            <div class="borderColor p-3">
                <h4 class="mb-3">Eliminar usuarios</h4>
                <h2>User id: {{ userIdSelected }}</h2>

                <div class="d-flex flex-column mx-auto">

                    <select v-model="userIdSelected" class="form-select">
                        <option selected disabled value="Elige un usuario">Elige un usuario</option>
                        <option v-for="user in usersData" :key="user.id" :value="user.id">{{ user.email }}</option>
                    </select>
                    
                    <button data-bs-toggle="modal" data-bs-target="#deleteUserModal" class="btn btn-primary mt-3">Borrar usuario</button>
                </div>

            </div>

            <div v-if="flagError">
                <p class="text-danger mt-3 fw-bold">{{ deleteMessage }}</p>
            </div>

            <div v-if="flagAlert" class="alert alertSuccessColors mt-4 text-center mx-auto p-4 m-4" role="alert">
                Usuario eliminado
            </div>

        </div>
    </div>

    <!-- DELETE MODAL -->
    <!-- Modal -->
    <div class="modal fade" id="deleteUserModal" tabindex="-1" aria-labelledby="deleteUserModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body d-flex flex-column py-5">
                    <p class="mx-auto">
                        ¿Desea eliminar al usuario para siempre?

                    </p>
                    <div class="d-flex justify-content-evenly">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Salir</button>
                        <button @click="() => deleteUser()" type="button" class="btn btn-danger"
                            data-bs-dismiss="modal">Eliminar</button>

                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<style scoped>
    .widthForms{
        max-width: 400px;
    }
</style>