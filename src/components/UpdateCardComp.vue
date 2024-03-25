<script setup>
import { onMounted, ref, watch } from 'vue'

const props = defineProps({
    elementId: Number,
    elementValues: Object
})

import { useAuthStore } from '@/stores/useAuthStore';
import { useUserStore } from '@/stores/useUserStore';
import { useFlagStore } from '@/stores/useFlagStore';

let authStore = useAuthStore();
const userStore = useUserStore();
let flagStore = useFlagStore();

//Valores para el formulario
const inputFrontText = ref('');
const inputBackText = ref('');

const toggleError = ref(false);
const flagAlert = ref(false);
const errorDetail = ref('Error al actualizar')

async function updateCard(e) {
    e.preventDefault();
    toggleError.value = false;
    try {
        
        const data = {id: props.elementId, frontText: inputFrontText.value, backText: inputBackText.value}

        const response = await fetch(`${import.meta.env.VITE_API_URL}cards/update`, {
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
            throw new Error('Error response is not ok');
        }

        const respuesta = await response.json();

        if (respuesta) {
            flagStore.toggleFlagCard();
            flagAlert.value = true;
            inputFrontText.value = '';
            inputBackText.value = '';

            // Cerrar el modal directamente
            setTimeout(() => {
                const updateModal = bootstrap.Modal.getInstance(document.getElementById('updateModal'));
                updateModal.hide();
                flagAlert.value = false;
            }, 2000)


        } else {
            flagAlert.value = false;
            toggleError.value = true;
            throw new Error('Error if deck');
        }

    } catch (error) {
        flagAlert.value = false;
        toggleError.value = true;
        console.error("Error al añadir Categoria", error);
    }
}

onMounted(() => {
    authStore = useAuthStore();
    flagStore = useFlagStore();

    // Asegurar que elementValues no sea undefined
    if (props.elementValues) { 
        inputFrontText.value = props.elementValues.front_text || '';
        inputBackText.value = props.elementValues.back_text || '';
    }
})


watch(() => props.elementValues, (newValues) => {
    if (newValues) {
        inputFrontText.value = newValues.front_text || '';
        inputBackText.value = newValues.back_text || '';
    }
}, { immediate: true });

</script>



<template>

    <div class="borde">
        <form class="w-75 mx-auto p-4 m-4" @submit="updateCard">

            <div class="mb-3">
                <label for="updateFrontCardInput" class="form-label">Palabra frontal</label>
                <input v-model="inputFrontText" type="text" class="form-control" id="updateFrontCardInput" placeholder="Hola" required
                    maxlength="50" minlength="3">
            </div>
            <div class="mb-3">
                <label for="updateBackCardInput" class="form-label">Solución</label>
                <input v-model="inputBackText" type="text" class="form-control" id="updateBackCardInput" placeholder="Hello" required
                    maxlength="50" minlength="3">
            </div>

            <div>
                <input type="submit" class="btn btn-primary w-100 mt-3" value="Actualizar" />
            </div>

            <div v-if="toggleError">
                <p class="text-danger mt-3 fw-bold">{{ errorDetail }}</p>
            </div>

            <div v-if="flagAlert" class="alert alertSuccessColors mt-4 text-center w-75 mx-auto p-4 m-4" role="alert">
                Carta actualizada correctamente.
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