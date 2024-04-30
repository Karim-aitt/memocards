<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { RouterLink } from 'vue-router'

import AddComponent from '@/components/Add/AddComponent.vue';
import UpdateComponent from '@/components/Update/UpdateComponent.vue';

import { useAuthStore } from '@/stores/useAuthStore';
import { useDeckStore } from '@/stores/useDeckStore';
import { useUserStore } from '@/stores/useUserStore';
import { useFlagStore } from '@/stores/useFlagStore';

import IconDelete from '@/components/icons/IconDelete.vue';
import IconPencil from '@/components/icons/IconPencil.vue';

const authStore = useAuthStore();
const deckStore = useDeckStore();
const userStore = useUserStore();
const flagStore = useFlagStore();

import { convertString } from '@/services/viewServices';


const validToken = computed(() => authStore.flagToken);
const userId = computed(() => userStore.userIdRef);

// Array con las categorias
const categories = ref([])
const numberOfCategories = ref(0);
const flagSpinner = ref(true);

const page = ref(1);
const isLoading = ref(false);
const allCategoriesLoaded = ref(false);

const viewType = ref('comunidad');

// Modificamos fetchCategories para resetear estados al cambiar entre vistas
const resetStatesBeforeFetch = () => {
    page.value = 1;
    categories.value = [];
    allCategoriesLoaded.value = false;
    flagSpinner.value = true;
};

// function loadMoreCategories(){
//     fetchCategories();
// }

const flagCategory = computed(() => flagStore.flagCategory);
watch(flagCategory, () => {
    resetStatesBeforeFetch()
    fetchUserCategories();
});

//Search functionality
const inputSearch = ref('');
const arrayFilteredCategories = ref([]);
let debounceTimeout = null; // Variable para mantener la referencia al timeout

// Observador que reacciona a cambios en inputSearch
watch(inputSearch, () => {
    // Si ya hay un temporizador en marcha, lo cancelamos para empezar uno nuevo
    if (debounceTimeout) {
        clearTimeout(debounceTimeout);
    }
    // Establecemos un nuevo temporizador
    debounceTimeout = setTimeout(() => {
        // Si el input de búsqueda está vacío, llama a fetchCategories
        if (inputSearch.value === '') {
            resetStatesBeforeFetch()
            fetchCategories();
        } else {
            // De lo contrario, realiza la búsqueda filtrada
            fetchFilteredCategories();
        }
    }, 300); // Retraso de 300 ms
});

const fetchCategories = async () => {
    if (isLoading.value || allCategoriesLoaded.value) return;
    isLoading.value = true; // Resetear estados antes de cada carga
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}category/?page=${page.value}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();


        if (data.categories.length === 0) {
            allCategoriesLoaded.value = true; // No hay más categorías para cargar

        } else {
            numberOfCategories.value = data.numberOfCategories
            categories.value = [...categories.value, ...data.categories];
            page.value++;
        }
    } catch (error) {
        console.error("Error al cargar los items:", error);
    } finally {
        isLoading.value = false;
        setTimeout(() => { flagSpinner.value = false }, 500)
    }
};


async function fetchFilteredCategories() {
    flagSpinner.value = true; // Mostrar el spinner de carga
    if (!inputSearch.value) { return }
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}category/filter/?input=${inputSearch.value}`)
        if (!response.ok) {
            throw new Error('Error en fetch filter');
        }
        categories.value = await response.json();
    } catch (error) {
        console.error('Error al obtener categorías filtradas:', error);
        // Manejar el error, por ejemplo, mostrando un mensaje al usuario
    } finally {
        flagSpinner.value = false; // Ocultar el spinner de carga
    }
}
// // Método computado para filtrar los mazos basado en el input del usuario
// const filteredCategories = computed(() => {
//     const searchQuery = inputSearch.value.toLowerCase();
//     return categories.value.filter(category =>
//         category.name.toLowerCase().includes(searchQuery)
//     )
// });

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

        setTimeout(() => {
            flagSpinner.value = false;

        }, 1000);

    } catch (error) {
        flagSpinner.value = false;
        console.error("Error al obtener categorias", error)
    }
}
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
        const response = await fetch(`${import.meta.env.VITE_API_URL}category/${id}`, {
            method: 'DELETE',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + userStore.userToken
            }
        })

        if (!response.ok) {
            alertErrorClass.value = "alert alert-danger"
            alertErrorText.value = 'Error al eliminar la categoria';
            alertErrorFlag.value = true;
            throw new Error('Error response is not ok');
        } else {
            alertErrorClass.value = "alert alert-success"
            alertErrorText.value = 'Categoria eliminada con éxito';
            alertErrorFlag.value = true;
            fetchUserCategories()

            setTimeout(() => {
                alertErrorFlag.value = false;
            }, 1000)
        }
    } catch (error) {
        console.error("Error al borrar la categoria", error);
    }
}
//Se setean los valores de la categoria para constractarlos en decksview
function setSelectedCategoryValues(id, creatorId) {
    deckStore.setSelectedCategoryId(id)
    deckStore.setSelectedCategoryCreatorId(creatorId)
}

// Nuevo método para manejar el clic en el botón "Comunidad"
const fetchCommunityButtonFunction = () => {
    viewType.value = 'comunidad';
    resetStatesBeforeFetch();
    fetchCategories();
};
const fetchCreadasButtonFunction = () => {
    viewType.value = 'creadas';
    resetStatesBeforeFetch();
    fetchUserCategories();
}

// Mejoras en el manejo del botón "Cargar más"
function loadMoreCategories() {
    if (viewType.value === 'comunidad') {
        fetchCategories();
    } else if (viewType.value === 'creadas') {
        fetchUserCategories();
    }
}

onMounted(() => {
    fetchCommunityButtonFunction();
});

</script>

<template>
    <div class="d-flex flex-column container-fluid ">
        <h1 class="my-4">Categorias</h1>

        <div class="row mb-4">
            <div class="col-lg-8">
                <div class="d-lg-flex">
                    <ul class="nav flex-lg-row ">
                        <li class="nav-item ">
                            <button class="nav-link active text-link rounded-4"
                                :class="{ 'active': viewType === 'comunidad' }"
                                @click="fetchCommunityButtonFunction">Comunidad</button>
                        </li>
                        <li v-if="validToken" class="nav-item">
                            <button class="nav-link text-link rounded-4 ms-2"
                                :class="{ 'active': viewType === 'creadas' }"
                                @click="fetchCreadasButtonFunction">Creadas por mi</button>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="col-lg-4">
                <div class="d-lg-flex justify-content-end">
                    <input v-model="inputSearch" class="form-control w-75 inputSearch mt-3 mt-lg-0" type="text"
                        placeholder="Nombre categoria..." />
                </div>
            </div>
        </div>

    </div>

    <div v-if="validToken" class="d-flex justify-content-start container-fluid my-2">
        <AddComponent pageName="Categoria" formComponent="AddCategoryComp" />
    </div>

    <div class="container-fluid mt-4">

        <div v-if="alertErrorFlag" :class="alertErrorClass" role="alert">
            {{ alertErrorText }}
        </div>

        <!-- Contenido mostrado cuando no hay mazos que coincidan con la búsqueda y se ha ingresado algo en el buscador -->
        <div v-if="categories.length === 0 && inputSearch.length > 0" class="alert alert-warning" role="alert">
            No se han encontrado coincidencias.
        </div>

        <div v-if="flagSpinner" class="spinner-border mx-auto fs-2 mt-3" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>

        <div v-else class="d-lg-flex justify-content-between flex-wrap">

            <div v-for="category in categories" :category="category" @updateElementId="updateElementId"
                :key="category.id" class="cardBox position-relative">

                <v-icon name="bi-layers-fill" style="width: 3rem; height: 3rem; color: var(--main-color)" />

                <div class="router-link-container position-absolute top-0 start-0 w-100 h-100">

                    <RouterLink :to="`/mazos/${category.id}/${category.name}`"
                        @click="setSelectedCategoryValues(category.id, category.created_by_user_id)"
                        class="text-decoration-none categoryName fs-4 d-flex justify-content-center align-items-center h-100">
                        {{convertString(category.name) }}
                    </RouterLink>
                    
                </div>

                <div v-if="userId === category.created_by_user_id || userStore.userRoleRef === 'admin'" class="ms-auto icons-container">
                    <IconPencil @click.stop="updateElementId(category.id)" data-bs-toggle="modal"
                        data-bs-target="#updateModal" class="me-3 iconLink"
                        style="width: 2rem; height: 2rem; color: var(--main-dark-1); position: relative; z-index: 2;" />

                    <UpdateComponent pageName="Categoria" formComponent="UpdateCategoryComp" :elementId="elementId" />

                    <IconDelete @click.stop="() => setDeleteElement(category.id)" data-bs-toggle="modal"
                        data-bs-target="#deleteModal" class="iconLink"
                        style="width: 2rem; height: 2rem; color: var(--main-dark-1); position: relative; z-index: 2;" />
                </div>
            </div>
        </div>
    </div>


    <button
        v-if="!allCategoriesLoaded && !flagSpinner && viewType === 'comunidad' && numberOfCategories > categories.length"
        @click="loadMoreCategories" class="btn btn-primary d-flex ms-auto my-3 mb-5 me-2">
        Cargar más
    </button>

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
.divAddComp {
    position: relative;
    left: 5rem;
}

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

.categoryName {
    color: var(--text-dark-1);
}

.categoryName:hover {
    color: var(--main-color-light);
    transition: 0.4s;
}
</style>
