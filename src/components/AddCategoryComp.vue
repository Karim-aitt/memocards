<script setup>
import { ref } from 'vue'
import { checkPassword, checkEmail } from '../services/registerServices.js'

import { useAuthStore } from '@/stores/useAuthStore';
import { useUserStore } from '@/stores/useUserStore';
import { useFlagStore } from '@/stores/useFlagStore';

const authStore = useAuthStore();
const flagStore = useFlagStore();

const categoryName = ref('');
const toggleError = ref(false);
const flagAlert = ref(false);

async function addCategory(e) {
    e.preventDefault();
    toggleError.value = false;
    try {
        const data = { name: categoryName.value }

        const response = await fetch(`${import.meta.env.VITE_API_URL}category/add`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authStore.token
            },
            body: JSON.stringify(data)
        })

        if (!response.ok) {
            toggleError.value = true;
            throw new Error('Error response is not ok');
        }

        const { category } = await response.json();
        console.log("categoria", category)

        if (category) {
            flagAlert.value = true;
            categoryName.value = '';
            flagStore.toggleFlagCategory();

            // Cerrar el modal directamente
            setTimeout(() => {
                const addModal = bootstrap.Modal.getInstance(document.getElementById('addModal'));
                addModal.hide();
                flagAlert.value = false;
            }, 2000)


        } else {
            flagAlert.value = false;
            toggleError.value = true;
            throw new Error('Error if category');
        }

    } catch (error) {
        flagAlert.value = false;
        toggleError.value = true;
        console.error("Error al añadir Categoria", error);
    }


}



</script>

<template>

    <div class="borde">
        <form class="w-75 mx-auto p-4 m-4" @submit="addCategory">

            <div class="mb-3">
                <label for="nameCategoryInput" class="form-label">Nombre de la Categoria</label>
                <input v-model="categoryName" type="text" class="form-control" id="nameCategoryInput" placeholder="..."
                    required maxlength="20" minlength="3">
            </div>

            <div class="">
                <input type="submit" class="btn btn-primary w-100" value="Añadir" />
            </div>

            <div v-if="toggleError">
                <p class="text-danger mt-3 fw-bold">Error al añadir</p>
            </div>

            <div v-if="flagAlert" class="alert alertSuccessColors mt-4 text-center w-75 mx-auto p-4 m-4" role="alert">
                Categoría añadida correctamente.
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
</style>