<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter, useRoute, RouterLink } from 'vue-router'

//Componentes
import AddComponent from '@/components/AddComponent.vue';
import UpdateComponent from '@/components/UpdateComponent.vue';
//Iconos
import IconDeck from '@/components/icons/IconDeck.vue';
import IconDelete from '@/components/icons/IconDelete.vue';
import IconPencil from '@/components/icons/IconPencil.vue';
//Stores
import { useAuthStore } from '@/stores/useAuthStore';
import { useUserStore } from '@/stores/useUserStore';
import { useDeckStore } from '@/stores/useDeckStore';
import { useFlagStore } from '@/stores/useFlagStore';
//Referencia de stores
const deckStore = useDeckStore();
const authStore = useAuthStore();
const userStore = useUserStore();
const flagStore = useFlagStore();

//Array de mazos
const decks = ref([]);

//Search functionality
const inputSearch = ref('');

//Para filtrar mazos
const filteredDecks = computed(() => {
    const searchQuery = inputSearch.value.toLowerCase();
    return decks.value.filter(deck =>
        (deck.name || "").toLowerCase().includes(searchQuery) ||
        deck.tag_names.some(tag => (tag || "").toLowerCase().includes(searchQuery))
    );
});

function filterByTag(tag) {
    inputSearch.value = tag;
}


import { convertString } from '@/services/viewServices';

const validToken = computed(() => authStore.flagToken);
const userId = computed(() => userStore.userIdRef)
const creatorId = deckStore.getSelectedDeckIdCreator() || null;
const categoryCreatorId = deckStore.getSelectedCategoryCreatorId() || null;

//Si es el creador de la categoria, muestra el boton de añadir cartas
const flagCreator = ref(false);

const flagDeck = computed(() => flagStore.flagDeck);

watch(flagDeck, () => {
    flagSpinner.value = true

    if (categoryId) {
        if (categoryCreatorId === userId.value) {

            flagCreator.value = true;
        } else {

            flagCreator.value = false;
        }

        setTimeout(() => {
            fetchDecksFromCategory()
        }, 500)
    } else {
        setTimeout(() => {
            fetchAllDecks()
        }, 500)
    }
});

//Obtencion de valores de la url
const route = useRoute();
const categoryId = route.params.categoryId || null;
const categoryName = ref(route.params.categoryName || null);

//Flag del spinner
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
        if (categoryCreatorId === userId.value) {
            
            flagCreator.value = true;
        } else {
            
            flagCreator.value = false;
        }

        setTimeout(() => {
            fetchDecksFromCategory()
        }, 500)
    } else {
        setTimeout(() => {
            flagCreator.value = true;
            fetchAllDecks()
        }, 500)
    }
})

const router = useRouter();
function goBack() {
    router.go(-1);
}
//Valor para pasar mediante props a UpdateDeckComp
const elementId = ref(0)
function updateElementId(newId) {
    elementId.value = newId;
}

//Flag para error
const alertErrorFlag = ref(false);
const alertErrorText = ref('');
const alertErrorClass = ref("alert alert-success")

const idDeleteElement = ref()

function setDeleteElement(id) {
    idDeleteElement.value = id
}
async function deleteElement() {
    const id = idDeleteElement.value
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}decks/${id}`, {
            method: 'DELETE',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + userStore.userToken
            }
        })

        if (!response.ok) {
            alertErrorClass.value = "alert alert-danger"
            alertErrorText.value = 'Error al eliminar el mazo';
            alertErrorFlag.value = true;
            throw new Error('Error response is not ok');
        } else {
            alertErrorClass.value = "alert alert-success"
            alertErrorText.value = 'Mazo eliminado con éxito';
            alertErrorFlag.value = true;
            flagSpinner.value = true

            if (categoryId) {
                if (categoryCreatorId === userId.value) {
                    
                    flagCreator.value = true;
                } else {
                    
                    flagCreator.value = false;
                }

                setTimeout(() => {
                    fetchDecksFromCategory()
                }, 500)
            } else {
                setTimeout(() => {
                    fetchAllDecks()
                }, 500)
            }

            setTimeout(() => {
                alertErrorFlag.value = false;
            }, 1000)
        }
    } catch (error) {
        console.error("Error al borrar la carta", error);
    }
}

function setDeckValues(deckId, created_by_user_id) {
    deckStore.setSelectedDeckId(deckId);
    deckStore.setSelectedDeckIdCreator(created_by_user_id);
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
                        <li class="nav-item">
                            <button @click="goBack" class="goBackButton nav-link">Volver</button>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="col-lg-4">
                <!-- BUSCADOR -->
                <div class="d-lg-flex justify-content-end">
                    <input v-model="inputSearch" class="form-control w-75 inputSearch" type="text"
                        placeholder="Nombre/etiquetas..." />
                </div>

            </div>
        </div>
    </div>

    <div v-if="validToken && flagCreator" class="d-flex justify-content-start container-fluid my-2">
        <AddComponent pageName="Mazo" formComponent="AddDeckComp" />
    </div>

    <div class="container-fluid mt-5">

        <div v-if="flagSpinner" class="spinner-border mx-auto fs-2" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
        <!-- Contenido mostrado cuando no hay mazos que coincidan con la búsqueda y se ha ingresado algo en el buscador -->
        <div v-if="filteredDecks.length === 0 && inputSearch.length > 0" class="alert alert-warning" role="alert">
            No se han encontrado coincidencias.
        </div>

        <!-- FOR RENDER -->
        <div v-else class="d-flex justify-content-between flex-wrap">
            <div v-for="deck in filteredDecks" :key="deck.id" class="cardBox">

                <IconDeck style="width: 2rem; height: 2rem; color: var(--main-color)" />
                <strong class="mx-3">{{ deck.category_name }}</strong>
                <div class="d-flex flex-column">



                    <RouterLink :to="`/cards/${deck.id}/${deck.name}`"
                        @click="setDeckValues(deck.id, deck.created_by_user_id)"
                        class="ms-2 text-decoration-none deckName ">
                        {{ convertString(deck.name) }}
                    </RouterLink>

                    <div class="ms-2 tagDiv">
                        <span v-for="tag in deck.tag_names" @click="filterByTag(tag)" style="cursor: pointer">{{ tag }}</span>
                    </div>

                </div>



                <div v-if="userId === deck.created_by_user_id" class="ms-auto">
                    <IconPencil @click="updateElementId(deck.id)" data-bs-toggle="modal" data-bs-target="#updateModal"
                        class="me-3 iconLink" style="width: 2rem; height: 2rem; color: var(--main-dark-1)" />

                    <UpdateComponent pageName="Mazo" formComponent="UpdateDeckComp" :elementId="elementId" />

                    <IconDelete @click="() => setDeleteElement(deck.id)" data-bs-toggle="modal"
                        data-bs-target="#deleteModal" class="iconLink"
                        style="width: 2rem; height: 2rem; color: var(--main-dark-1)" />
                </div>

            </div>
        </div>

        <div v-if="alertErrorFlag" :class="alertErrorClass" role="alert">
            {{ alertErrorText }}
        </div>

        <div v-if="!decks.length > 0 && !flagSpinner">
            <h3>No se han encontrado mazos en esta categoria.</h3>
        </div>

    </div>

    <!-- DELETE MODAL -->
    <!-- Modal -->
    <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body d-flex flex-column py-5">
                    <p class="mx-auto">
                        ¿Desea eliminar el elemento para siempre?

                    </p>
                    <div class="d-flex justify-content-evenly">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Salir</button>
                        <button @click="() => deleteElement()" type="button" class="btn btn-danger"
                            data-bs-dismiss="modal">Eliminar</button>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
h1 {
    color: var(--main-color);
}

.tagDiv span:not(:first-child) {
    margin-left: 7px;
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
    color: var(--secondary-color);
}

.deckName:hover {
    color: var(--main-color-light);
    transition: 0.4s;
}
</style>