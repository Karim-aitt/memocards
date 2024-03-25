<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router';

import { useAuthStore } from '@/stores/useAuthStore';
import { useUserStore } from '@/stores/useUserStore';
import { useFlagStore } from '@/stores/useFlagStore';

const userStore = useUserStore();
const authStore = useAuthStore();
const flagStore = useFlagStore();

const route = useRoute();

//Valores para el formulario
const deckNameRoute = ref(route.params.deckName || null)
const inputFrontText = ref('');
const inputBackText = ref('');

//Flags de alertas
const toggleError = ref(false);
const flagAlert = ref(false);

async function addCard(e) {
    e.preventDefault();
    toggleError.value = false;
    try {
        
        const data = {frontText: inputFrontText.value, backText: inputBackText.value, deckName: deckNameRoute.value}

        const response = await fetch(`${import.meta.env.VITE_API_URL}cards/addcard/${deckNameRoute.value}`, {
            method: 'POST',
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
                // const addModal = bootstrap.Modal.getInstance(document.getElementById('addModal'));
                // addModal.hide();
                flagAlert.value = false;
            }, 1000)
            

        } else {
            flagAlert.value = false;
            toggleError.value = true;
            throw new Error('Error if deck');
        }

    } catch (error) {
        flagAlert.value = false;
        toggleError.value = true;
        console.error("Error al añadir Carta", error);
    }


}

</script>

<template>

    <div class="borde">
        <form class="w-75 mx-auto p-4 m-4" @submit="addCard">

            <div class="mb-3">
                <label for="frontCardInput" class="form-label">Palabra frontal</label>
                <input v-model="inputFrontText" type="text" class="form-control" id="frontCardInput" placeholder="Hola" required
                    maxlength="50" minlength="3">
            </div>
            <div class="mb-3">
                <label for="backCardInput" class="form-label">Solución</label>
                <input v-model="inputBackText" type="text" class="form-control" id="backCardInput" placeholder="Hello" required
                    maxlength="50" minlength="3">
            </div>

            <div>
                <input type="submit" class="btn btn-primary w-100 mt-3" value="Añadir" />
            </div>

            <div v-if="toggleError">
                <p class="text-danger mt-3 fw-bold">Error al añadir</p>
            </div>

            <div v-if="flagAlert" class="alert alertSuccessColors mt-4 text-center w-75 mx-auto p-4 m-4" role="alert">
                Carta añadida correctamente.
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