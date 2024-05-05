<script setup>
const props = defineProps({
    elementId: Number,
})

import { onMounted, ref } from 'vue'

import { useAuthStore } from '@/stores/useAuthStore';
import { useUserStore } from '@/stores/useUserStore';
import { useFlagStore } from '@/stores/useFlagStore';

const userStore = useUserStore();
let authStore = useAuthStore();
let flagStore = useFlagStore();

const newDeckName = ref('');
const data = ref({ id: props.elementId, newDeckName: newDeckName.value, tags: [] })
const tags = ref('');

const toggleError = ref(false);
const flagAlert = ref(false);
const errorDetail = ref('Error al añadir')

// Dividir la cadena por espacios y filtrar elementos vacíos
function splitTags(inputString) {
  tags.value = inputString.split(' ').filter(tag => tag.trim().startsWith('#'));
}

async function updateDeck(e){
    e.preventDefault();
    toggleError.value = false;
    splitTags(tags.value)
    try {
        data.value = { id: props.elementId, newDeckName: newDeckName.value, tags: tags.value }
        
        const response = await fetch(`${import.meta.env.VITE_API_URL}decks/update`, {
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
                newDeckName.value = ''
                errorDetail.value = 'El nombre ya existe'
                throw new Error('Error: El nombre ya existe');
            }

            throw new Error('Error response is not ok');

        } else {
            flagAlert.value = true;
            newDeckName.value = '';
            tags.value = ''
            flagStore.toggleFlagDeck();

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
        console.error("Error al actualizar el Mazo", error);
    }
}

onMounted(() => {
    authStore = useAuthStore();
    flagStore = useFlagStore();
})

</script>



<template>

    <div class="borde">
        <form class="w-75 mx-auto p-4 m-4" @submit="updateDeck">

            <div class="mb-3">
                <label for="nameDeckInput" class="form-label">Nuevo nombre del mazo</label>
                <input v-model="newDeckName" type="text" class="form-control" placeholder="Ingles..."
                    required maxlength="20" minlength="3">
            </div>

            <div class="mb-3">
                <label for="tagsInput" class="form-label">Etiquetas</label>
                <input v-model="tags" type="text" class="form-control" placeholder="#ingles #a1 #vocabulary"
                    maxlength="20" minlength="3">
            </div>

            <div class="">
                <input type="submit" class="btn btn-primary w-100" value="Actualizar" />
            </div>

            <div v-if="toggleError">
                <p class="text-danger mt-3 fw-bold">{{ errorDetail }}</p>
            </div>

            <div v-if="flagAlert" class="alert alertSuccessColors mt-4 text-center w-75 mx-auto p-4 m-4" role="alert">
                Mazo actualizada correctamente.
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