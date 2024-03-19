<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute, RouterLink } from 'vue-router'

import IconCard from '@/components/icons/IconCard.vue';
import IconDelete from '@/components/icons/IconDelete.vue';
import IconPencil from '@/components/icons/IconPencil.vue';

import PlayComponent from '../components/PlayComponent.vue';

import { useAuthStore } from '@/stores/useAuthStore';
import { useUserStore } from '@/stores/useUserStore';
import { useDeckStore } from '@/stores/useDeckStore';

const deckStore = useDeckStore();
const authStore = useAuthStore();
const userStore = useUserStore();

const validToken = computed(() => authStore.flagToken);
const userId = computed(() => userStore.userIdRef);

const route = useRoute();
const deckName = ref(route.params.deckName || null);
const deckId = deckStore.getSelectedDeckId() || route.params.deckId;

const cards = ref([])
const flagSpinner = ref(true);
const playMode = ref(false);

function toggleMode() {
    playMode.value = !playMode.value
}

async function fetchDeckCards() {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}cards/${deckId}`, {
            method: 'GET',
            mode: 'cors'
        })

        if (response.ok) {
            cards.value = await response.json();
            // flagSpinner.value = false;

        } else if (response.status === 404) {
            flagSpinner.value = false;

        } else {
            throw new Error('Error en fetch Mazos')
        }

    } catch (error) {
        console.error("Error al obtener mazos", error)
    } finally {
        flagSpinner.value = false;
    }
}

async function fetchCards() {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}cards/${deckName.value}`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Authorization': 'Bearer ' + userStore.userToken
            }
        })
        if (!response.ok) {
            throw new Error('Error en fetch Mazos')
        }
        cards.value = await response.json();
        flagSpinner.value = false;
    } catch (error) {
        flagSpinner.value = false;
        console.error("Error al obtener mazos", error)
    }
}

onMounted(() => {
    flagSpinner.value = true;
    setTimeout(() => {
        fetchDeckCards()
    }, 500)
})

const router = useRouter();
function goBack() {
    router.go(-1);
}

</script>

<template>
    <div class="d-flex flex-column container-fluid ">
        <h1 class="my-4">Cartas</h1>

        <div class="row mb-4">
            <div class="d-flex justify-content-between w-100">
                <ul class="nav">
                    <li class="nav-item">
                        <h3 v-if="deckName">{{ playMode ? 'Modo de Juego' : 'Cartas del mazo ' + deckName }}</h3>
                    </li>
                </ul>
                <button class="btn btn-primary fw-semibold" @click="toggleMode">{{ playMode ? 'CARTAS' : 'JUGAR'
                    }}</button>
            </div>
        </div>


        <button @click="goBack" class="goBackButton nav-link me-auto ms-1 mt-2">Volver</button>
    </div>

    <hr class="my-5 py-3 border-2 text-secondary separator">

    <div v-if="!playMode" class="container-fluid mt-5">

        <div v-if="flagSpinner" class="spinner-border mx-auto fs-2" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>

        <div v-else class="d-flex justify-content-between flex-wrap">
            <div v-for="card in cards" :key="card.id" class="
                d-flex
                border 
                border-2 
                border-secondary 
                rounded 
                align-items-center 
                p-4
                my-3
                widthCategory
                ">
                <IconCard style="width: 2rem; height: 2rem; color: var(--main-color)"/>
                <h3 class="ms-4 cardName my-auto">{{ card.front_text }}
                </h3>

                <div v-if="userId === card.created_by_user_id" class="ms-auto me-3">
                    <IconPencil class="me-3 iconLink" style="width: 2rem; height: 2rem; color: var(--main-dark-1)" />
                    <IconDelete class="iconLink" style="width: 2rem; height: 2rem; color: var(--main-dark-1)" />
                </div>
            </div>
        </div>

        <div v-if="!cards.length > 0 && !flagSpinner">
            <h3>No se han encontrado cartas en este mazo.</h3>
        </div>

    </div>
    <PlayComponent v-else :cards="cards" />
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
}

.text-link:hover {
    color: var(--main-color);
}

.text-link:active {
    color: var(--main-color);
}

.cardName {
    color: var(--text-dark-1);
}
</style>

