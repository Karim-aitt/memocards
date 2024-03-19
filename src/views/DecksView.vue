<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore';
import { useUserStore } from '@/stores/useUserStore';
import { useDeckStore } from '@/stores/useDeckStore';

import IconDeck from '@/components/icons/IconDeck.vue';
import IconDelete from '@/components/icons/IconDelete.vue';
import IconPencil from '@/components/icons/IconPencil.vue';

const deckStore = useDeckStore();
const authStore = useAuthStore();
const userStore = useUserStore();

const validToken = computed(() => authStore.flagToken);
const userId = computed(() => userStore.userIdRef)

const route = useRoute();
const categoryId = route.params.categoryId || null;
const categoryName = ref(route.params.categoryName || null);

const decks = ref([])
const flagSpinner = ref(true);

async function fetchDecksFromCategory() {

    try {
        flagSpinner.value = true;
        const response = await fetch(`${import.meta.env.VITE_API_URL}decks/category/${categoryId}`)
        if (!response.ok) {
            throw new Error('Error en fetch Mazos')
        }
        decks.value = await response.json();
        flagSpinner.value = false;
    } catch (error) {
        flagSpinner.value = false;
        console.error("Error al obtener mazos", error)
    }
}

async function fetchAllDecks() {

    categoryName.value = null;

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}decks/all`)
        if (!response.ok) {
            throw new Error('Error en fetch Mazos')
        }
        decks.value = await response.json();
        
        flagSpinner.value = false;

    } catch (error) {
        flagSpinner.value = false;
        console.error("Error al obtener mazos", error)
    }
}

async function fetchUserDecks() {
    categoryName.value = null;
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}decks`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Authorization': 'Bearer ' + userStore.userToken
            }
        })
        if (!response.ok) {
            throw new Error('Error en fetch Mazos')
        }
        decks.value = await response.json();
        flagSpinner.value = false;
    } catch (error) {
        flagSpinner.value = false;
        console.error("Error al obtener mazos", error)
    }
}

onMounted(() => {
    flagSpinner.value = true

    if (categoryId) {
        setTimeout(() => {
            fetchDecksFromCategory()
        }, 500)
    } else {
        setTimeout(() => {
            fetchAllDecks()
        }, 500)
    }
})

const router = useRouter();
function goBack() {
    router.go(-1);
}

</script>

<template>
    <div class="d-flex flex-column container-fluid ">
        <h1 class="my-4">Mazos</h1>
        <h3 v-if="categoryName" class="mb-2">Mazos de la categoria <span>{{ categoryName }}</span></h3>

        <div class="row mb-4 mt-4">
            <div class="col-lg-8">
                <div class="d-lg-flex ">
                    <ul class="nav flex-lg-row ">
                        <li class="nav-item ">
                            <button class="nav-link active text-link rounded-4"
                                @click="fetchAllDecks">Comunidad</button>
                        </li>
                        <li v-if="validToken" class="nav-item">
                            <button class="nav-link text-link rounded-4 ms-2" @click="fetchUserDecks">Creados</button>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="col-lg-4">
                <div class="d-lg-flex justify-content-end">
                    <input class="form-control w-75" type="text" placeholder="Nombre/etiquetas..." />
                </div>
            </div>
        </div>


        <button @click="goBack" class="goBackButton nav-link me-auto ms-1 mt-2">Volver</button>
    </div>
    <div class="container-fluid mt-5">

        <div v-if="flagSpinner" class="spinner-border mx-auto fs-2" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>

        <div v-else class="d-flex justify-content-between flex-wrap">
            <div v-for="deck in decks" :key="deck.id" class="d-flex border border-2 border-secondary rounded align-items-center p-4 my-3 widthCategory">
                
                <IconDeck style="width: 2rem; height: 2rem; color: var(--main-color)" />
                <RouterLink :to="`/cards/${deck.id}/${deck.name}`" @click="deckStore.setSelectedDeckId(deck.id)"
                    class="ms-4 text-decoration-none deckName ">
                    {{ deck.name }}</RouterLink>

                <div v-if="userId === deck.created_by_user_id" class="ms-auto me-3">
                    <IconPencil class="me-3 iconLink" style="width: 2rem; height: 2rem; color: var(--main-dark-1)" />
                    <IconDelete class="iconLink" style="width: 2rem; height: 2rem; color: var(--main-dark-1)" />
                </div>

            </div>
        </div>

        <div v-if="!decks.length > 0 && !flagSpinner">
            <h3>No se han encontrado mazos en esta categoria.</h3>
        </div>

    </div>
</template>

<style scoped>
h1 {
    color: var(--main-color);
}

.widthCategory {
    width: 45%;
}


.text-link {
    color: var(--text-dark-1);
    border: 1px solid;
    border-color: var(--main-color);
}

.text-link:hover {
    color: var(--main-color);
}

.text-link:active {
    color: var(--main-color);
}

.deckName {
    color: var(--text-dark-1);
}

.deckName:hover {
    color: var(--main-color-light);
    transition: 0.4s;
}
</style>