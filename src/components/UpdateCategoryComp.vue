<script setup>
const props = defineProps({
    elementId: Number
})

import { onMounted, ref } from 'vue'

import { useAuthStore } from '@/stores/useAuthStore';
import { useUserStore } from '@/stores/useUserStore';
import { useFlagStore } from '@/stores/useFlagStore';

let authStore = useAuthStore();
const userStore = useUserStore();
let flagStore = useFlagStore();

const newCategoryName = ref('');
const data = ref({ id: props.elementId, newCategoryName: newCategoryName.value })

const toggleError = ref(false);
const flagAlert = ref(false);
const errorDetail = ref('Error al añadir')

async function updateCategory(e){
    e.preventDefault();
    toggleError.value = false;

    try {
        data.value = { id: props.elementId, newCategoryName: newCategoryName.value }
        

        const response = await fetch(`${import.meta.env.VITE_API_URL}category/update`, {
            method: 'PUT',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + userStore.userToken
            },
            body: JSON.stringify(data.value)
        })

        if (!response.ok) {
            flagAlert.value = false;
            toggleError.value = true;

            if(response.status === 400){
                newCategoryName.value = ''
                errorDetail.value = 'El nombre ya existe'
            }

            throw new Error('Error response is not ok');

        } else {
            flagAlert.value = true;
            newCategoryName.value = '';
            flagStore.toggleFlagCategory();

            // Cerrar el modal directamente
            setTimeout(() => {
                const updateModal = bootstrap.Modal.getInstance(document.getElementById('updateModal'));
                updateModal.hide();
                flagAlert.value = false;
            }, 2000)
        }
        
    } catch (error) {
        flagAlert.value = false;
        toggleError.value = true;
        console.error("Error al actualizar la Categoria", error);
    }
}

onMounted(() => {
    authStore = useAuthStore();
    flagStore = useFlagStore();
})

</script>



<template>

    <div class="borde">
        <form class="w-75 mx-auto p-4 m-4" @submit="updateCategory">

            <div class="mb-3">
                <label for="nameCategoryInput" class="form-label">Nuevo nombre de la Categoria</label>
                <input v-model="newCategoryName" type="text" class="form-control" placeholder="Idiomas..."
                    required maxlength="20" minlength="3">
            </div>

            <div class="">
                <input type="submit" class="btn btn-primary w-100" value="Actualizar" />
            </div>

            <div v-if="toggleError">
                <p class="text-danger mt-3 fw-bold">{{ errorDetail }}</p>
            </div>

            <div v-if="flagAlert" class="alert alertSuccessColors mt-4 text-center w-75 mx-auto p-4 m-4" role="alert">
                Categoría actualizada correctamente.
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