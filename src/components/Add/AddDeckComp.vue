<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router';

import { useUserStore } from '@/stores/useUserStore';
import { useFlagStore } from '@/stores/useFlagStore';

const userStore = useUserStore();
const flagStore = useFlagStore();

const route = useRoute();

//Valores para el formulario
const categoryNameRoute = ref(route.params.categoryName || null)
const categoryNameSelect = ref('');
const deckName = ref('');
const tags = ref('');
const data = ref({});
const categories = ref([]);

//Flags de alertas
const toggleError = ref(false);
const flagAlert = ref(false);

// Dividir la cadena por espacios y filtrar elementos vacíos
function splitTags(inputString) {
  tags.value = inputString.split(' ').filter(tag => tag.trim().startsWith('#'));
}

async function addDeck(e) {
    e.preventDefault();
    toggleError.value = false;
    splitTags(tags.value)
    try {
        if (categoryNameRoute.value !== null) {
            data.value = { deckName: deckName.value, categoryName: categoryNameRoute.value, tags: tags.value }
            
        } else {
            data.value = { deckName: deckName.value, categoryName: categoryNameSelect.value, tags: tags.value }
            
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}decks/add`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + userStore.userToken
            },
            body: JSON.stringify(data.value)
        })

        if (!response.ok) {
            toggleError.value = true;
            throw new Error('Error response is not ok');
        }

        const { deck } = await response.json();

        if (deck) {
            flagStore.toggleFlagDeck();
            flagAlert.value = true;
            deckName.value = '';

            // Cerrar el modal directamente
            setTimeout(() => {
                // const addModal = bootstrap.Modal.getInstance(document.getElementById('addModal'));
                // addModal.hide();
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

async function fetchUserCategories() {
    try {

        const response = await fetch(`${import.meta.env.VITE_API_URL}category/user`, {
            headers: {
                'Authorization': 'Bearer ' + userStore.userToken
            }
        })
        if (!response.ok) {
            throw new Error('Error en fetch categories')
        }
        categories.value = await response.json();

    } catch (error) {
        console.error("Error al obtener categorias", error)
    }
}

onMounted(() => {
    if(categoryNameRoute.value === null){
        fetchUserCategories();
    }
})

//Vigila si se cambia la ruta
watch(() => route.path, (newPath) => {
    if(newPath === '/mazos'){
        categoryNameRoute.value = null;
        fetchUserCategories();
    }
})

</script>

<template>

    <div class="borde">
        <form class="w-75 mx-auto p-4 m-4" @submit="addDeck">

            <div class="mb-3">
                <label for="nameDeckInput" class="form-label">Nombre del Mazo</label>
                <input v-model="deckName" type="text" class="form-control" id="nameDeckInput" placeholder="..." required
                    maxlength="20" minlength="3">
            </div>

            <div class="mb-3">
                <label for="tagsInput" class="form-label">Etiquetas</label>
                <input v-model="tags" type="text" class="form-control" id="tagsInput" placeholder="#ingles #a1 #vocabulary"
                    maxlength="20" minlength="3">
            </div>

            <div v-if="categoryNameRoute == null" class="mb-1">
                <label for="nameDeckInput" class="form-label">Categoria</label>
                <select v-model="categoryNameSelect" class="form-select" id="selectCategory">
                    <option selected disabled>Elige la categoria del mazo</option>
                    <option v-for="category in categories" :key="category.id" :value="category.name">
                        {{ category.name }}
                    </option>
                </select>
            </div>

            <div class="">
                <input type="submit" class="btn btn-primary w-100 mt-4" value="Añadir" />
            </div>

            <div v-if="toggleError">
                <p class="text-danger mt-3 fw-bold">Error al añadir</p>
            </div>

            <div v-if="flagAlert" class="alert alertSuccessColors mt-4 text-center w-75 mx-auto p-4 m-4" role="alert">
                Mazo añadido correctamente.
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