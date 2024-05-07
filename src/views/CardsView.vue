<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router'

//Servicios
import { truncateText } from '../services/viewServices.js';

//Iconos
import IconDelete from '@/components/icons/IconDelete.vue';
import IconPencil from '@/components/icons/IconPencil.vue';
//Componentes
import AddComponent from '@/components/Add/AddComponent.vue';
import PlayComponent from '@/components/PlayComponent.vue';
import UpdateComponent from '@/components/Update/UpdateComponent.vue';

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

const isMobile = computed(() => flagStore.flagMobile);

//Flag para el refresco de cartas
const flagCard = computed(() => flagStore.flagCard);
//Refrescar las cartas al añadir una nueva
watch(flagCard, () => {
    fetchDeckCards()
});


//Token de validacion
const validToken = computed(() => authStore.flagToken);
//Id del usuario
const userId = computed(() => userStore.userIdRef);

//Ruta
const route = useRoute();

//Valores para las cartas
const deckName = ref(route.params.deckName || null);
const deckId = deckStore.getSelectedDeckId() || route.params.deckId;
const creatorId = deckStore.getSelectedDeckIdCreator() || null;


//Array de renderizado de cartas
const cards = ref([])

//Flag creator, si es el creador del mazo, muestra el boton de añadir cartas
const flagCreator = ref(false);

//Flag del spinner
const flagSpinner = ref(true);

//Flag para error
const alertErrorFlag = ref(false);
const alertErrorText = ref('');
const alertErrorClass = ref("alert alert-success")

//Toggle de modo de juego / modo de visualizacion
const playMode = ref(false);

function toggleMode() {
    playMode.value = !playMode.value
    flagStore.toggleFlagPlayMode();
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
            cards.value = [];
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


onMounted(() => {

    if (creatorId === userId.value) {

        flagCreator.value = true;
    } else {

        flagCreator.value = false;
    }

    flagSpinner.value = true;
    setTimeout(() => {
        fetchDeckCards()
    }, 500)

})

//Volver una página atrás
const router = useRouter();
function goBack() { router.go(-1); }

//Valor para pasar mediante props a UpdateCardComp
const elementId = ref(0)
const elementValues = ref()

function updateElementId(newId, card) {
    elementId.value = newId;
    elementValues.value = card
}

const idDeleteElement = ref()
function setDeleteElement(id) {
    idDeleteElement.value = id
}

async function deleteElement() {
    const id = idDeleteElement.value
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}cards/${id}`, {
            method: 'DELETE',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + userStore.userToken
            }
        })

        if (!response.ok) {
            alertErrorClass.value = "alert alert-danger"
            alertErrorText.value = 'Error al eliminar la carta';
            alertErrorFlag.value = true;
            throw new Error('Error response is not ok');
        } else {
            alertErrorClass.value = "alert alert-success"
            alertErrorText.value = 'Carta eliminada con éxito';
            alertErrorFlag.value = true;
            fetchDeckCards()

            setTimeout(() => {
                alertErrorFlag.value = false;
            }, 1000)
        }

    } catch (error) {
        console.error("Error al borrar la carta", error);
    }

}

</script>

<template>
    <div class="d-flex flex-column container-fluid ">
        <h1 v-if="!playMode" class="my-4 my-lg-4">Cartas</h1>
        <h1 v-if="!isMobile && playMode" class="my-0 my-lg-4 mx-auto">Modo de juego</h1>

        <div class="row mb-4">
            <div class="d-lg-flex justify-content-lg-between w-100">

                <ul class="nav flex-column flex-lg-row">
                    <li v-if="!playMode" class="nav-item">
                        <h3 v-if="deckName">{{ 'Cartas del mazo ' + deckName }}</h3>
                    </li>
                    <li v-if="!playMode" class="nav-item">
                        <button @click="goBack" class="goBackButton nav-link">Volver</button>
                    </li>
                </ul>

                <button v-if="!playMode && !isMobile" class="btn btn-primary fw-semibold mt-3 mt-lg-0"
                    @click="toggleMode">MEMORIZAR</button>

                <button v-if="playMode" class="nav-link fw-semibold salirPlayModeButton ms-auto p-2 px-3 mt-3 mt-lg-0"
                    @click="toggleMode">
                    Salir</button>

            </div>



        </div>


        <div v-if="validToken && flagCreator && !playMode" class="mb-3 mb-lg-0">
            <AddComponent pageName="Carta" formComponent="AddCardComp" />
        </div>


        <button v-if="!playMode && isMobile" class="btn btn-primary fw-semibold my-1 py-3 mx-1"@click="toggleMode">MEMORIZAR</button>
    </div>


    <div v-if="!playMode" class="container-fluid mt-1 mt-lg-5">

        <div v-if="flagSpinner" class="spinner-border mx-auto fs-2" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>

        <div v-else class="d-flex justify-content-between flex-wrap">
            <div v-for="card in cards" :key="card.id" class="cardBox ">

                <!-- <IconCard style="width: 2rem; height: 2rem; color: var(--main-color)" /> -->
                <v-icon v-if="!isMobile" name="bi-layers" style="width: 3rem; height: 3rem; color: var(--main-color)" />

                <p class="ms-lg-3 fs-5 my-auto text-nowrap">{{ truncateText(card.front_text, 7) }}
                </p>

                <p v-if="isMobile && card.back_text.length > 4" class="ms-1 ms-lg-4 fs-5 my-auto text-nowrap">⇒ <span
                        class="textColor">...</span></p>
                <p v-else class="ms-2 ms-lg-2 fs-5 my-auto text-nowrap">⇒ <span class="textColor">{{ truncateText(card.back_text, 7)
                        }}</span>
                </p>

                <div v-if="userId === card.created_by_user_id || userStore.userRoleRef === 'admin'"
                    class="ms-auto me-lg-3">
                    <IconPencil @click="updateElementId(card.id, card)" data-bs-toggle="modal"
                        data-bs-target="#updateModal" class="me-lg-3 me-2 iconLink"
                        style="width: 2rem; height: 2rem; color: var(--main-dark-1)" />

                    <UpdateComponent pageName="Carta" formComponent="UpdateCardComp" :elementId="elementId"
                        :elementValues="elementValues" />


                    <IconDelete @click="() => setDeleteElement(card.id)" data-bs-toggle="modal"
                        data-bs-target="#deleteModal" class="iconLink"
                        style="width: 2rem; height: 2rem; color: var(--main-dark-1)" />
                </div>
            </div>
        </div>

        <div v-if="!cards.length > 0 && !flagSpinner">
            <h3>No se han encontrado cartas en este mazo.</h3>
        </div>

        <div v-if="alertErrorFlag" :class="alertErrorClass" role="alert">
            {{ alertErrorText }}
        </div>

    </div>
    <PlayComponent v-else :cards="cards" />

    <hr v-if="!playMode">

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

.salirPlayModeButton {
    border: 1px solid var(--border-color);
    border-radius: 5px;
}

.salirPlayModeButton:hover {
    color: var(--main-color) !important;

}
</style>
