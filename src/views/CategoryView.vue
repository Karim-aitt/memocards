<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { RouterView, useRoute, RouterLink } from 'vue-router'

import AddComponent from '@/components/AddComponent.vue';
import UpdateComponent from '@/components/UpdateComponent.vue';

import { useAuthStore } from '@/stores/useAuthStore';
import { useDeckStore } from '@/stores/useDeckStore';
import { useUserStore } from '@/stores/useUserStore';
import { useFlagStore } from '@/stores/useFlagStore';

import IconCategory from '@/components/icons/IconCategory.vue';
import IconDelete from '@/components/icons/IconDelete.vue';
import IconPencil from '@/components/icons/IconPencil.vue';

const authStore = useAuthStore();
const deckStore = useDeckStore();
const userStore = useUserStore();
const flagStore = useFlagStore();

import { convertString } from '@/services/viewServices';


const currentPage = ref(1);
const totalPages = ref(0);

async function fetchCategories(page = 1) {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}category?page=${page}`);
        if (!response.ok) {
            throw new Error('Error en fetch categories');
        }
        const data = await response.json();
        categories.value = data.categories; // Asume que la respuesta tiene esta estructura
        totalPages.value = data.totalPages; // Asume que la respuesta incluye el total de páginas
        currentPage.value = page;
    } catch (error) {
        console.error("Error al obtener categorias", error);
    }
}


const flagCategory = computed(() => flagStore.flagCategory);

watch(flagCategory, () => {
    fetchAllCategories()
});

//Search functionality
const inputSearch = ref('');

// Método computado para filtrar los mazos basado en el input del usuario
const filteredCategories = computed(() => {
  // Convertir el texto de búsqueda a minúsculas para una comparación insensible a mayúsculas/minúsculas
  const searchQuery = inputSearch.value.toLowerCase();

  // Filtrar los mazos si el nombre incluye el texto de búsqueda
  // o alguna de las etiquetas incluye el texto de búsqueda
    return categories.value.filter(category => 
    category.name.toLowerCase().includes(searchQuery)
    );
});



const validToken = computed(() => authStore.flagToken);
const userId = computed(() => userStore.userIdRef);

// Array con las categorias
const categories = ref([])
const flagSpinner = ref(true);

async function fetchAllCategories(id) {
    const lastCategoryId = id;

    try {
        
        const response = await fetch(`${import.meta.env.VITE_API_URL}category`)
        if (!response.ok) {
            throw new Error('Error en fetch categories')
        }
        categories.value = await response.json();
        //Para quitar el spinner después de 1 segundo
        setTimeout(() => {
            flagSpinner.value = false;

        }, 500);

    } catch (error) {
        flagSpinner.value = false;
        console.error("Error al obtener categorias", error)
    }
}

async function fetchUserCategories() {
//TODO: filtro de categorias creadas x el usuario
    try {
        
        const response = await fetch(`${import.meta.env.VITE_API_URL}category/user`,{
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

onMounted(() => {
    flagSpinner.value = true
    setTimeout(() => {
        fetchAllCategories();

    }, 200)
})

//Valor para pasar mediante props a UpdateCategoryComp
const elementId = ref(0)

function updateElementId(newId) {
    elementId.value = newId;
}

//Flag para error
const alertErrorFlag = ref(false);
const alertErrorText = ref('');
const alertErrorClass = ref("alert alert-success")

const idDeleteElement = ref()

function setDeleteElement(id){
    idDeleteElement.value = id
}

async function deleteElement(){
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

        if (!response.ok){
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
function setSelectedCategoryValues(id, creatorId){
    deckStore.setSelectedCategoryId(id)
    deckStore.setSelectedCategoryCreatorId(creatorId)
}

</script>

<template>
    <div class="d-flex flex-column container-fluid ">
        <h1 class="my-4">Categorias</h1>


        <div class="row mb-4">
            <div class="col-lg-8">
                <div class="d-lg-flex">
                    <ul class="nav flex-lg-row ">
                        <li class="nav-item ">
                            <button class="nav-link active text-link rounded-4" @click="fetchAllCategories">Comunidad</button>
                        </li>
                        <li v-if="validToken" class="nav-item">
                            <button class="nav-link text-link rounded-4 ms-2" @click="fetchUserCategories">Creadas</button>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="col-lg-4">
                <div class="d-lg-flex justify-content-end">
                    <input v-model="inputSearch" class="form-control w-75 inputSearch" type="text" placeholder="Nombre categoria..." />
                </div>
            </div>
        </div>

    </div>

    <div v-if="validToken" class="d-flex justify-content-start container-fluid my-2">
            <AddComponent pageName="Categoria" formComponent="AddCategoryComp"/>
        </div>

    <div class="container-fluid mt-4">

        

        <!-- Contenido mostrado cuando no hay mazos que coincidan con la búsqueda y se ha ingresado algo en el buscador -->
        <div v-if="filteredCategories.length === 0 && inputSearch.length > 0" class="alert alert-warning" role="alert">
            No se han encontrado coincidencias.
        </div>

        <div v-if="flagSpinner" class="spinner-border mx-auto fs-2 mt-3" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>

        <div v-else class="d-flex justify-content-between flex-wrap">

            <div v-for="category in filteredCategories"
            :category="category"
            @updateElementId="updateElementId"
            :key="category.id"
            class="cardBox">

                <IconCategory style="width: 2rem; height: 2rem; color: var(--main-color)"/>

                <RouterLink :to="`/mazos/${category.id}/${category.name}`" @click="setSelectedCategoryValues(category.id, category.created_by_user_id)" 
                class="ms-4 text-decoration-none categoryName">{{ convertString(category.name) }}</RouterLink>



                <div v-if="userId === category.created_by_user_id" class="ms-auto ">
                    <IconPencil
                        @click="updateElementId(category.id)"
                        data-bs-toggle="modal" 
                        data-bs-target="#updateModal" 
                        class="me-3 iconLink" 
                        style="width: 2rem; height: 2rem; color: var(--main-dark-1)" />

                    <UpdateComponent pageName="Categoria" formComponent="UpdateCategoryComp" :elementId="elementId"/>

                    <IconDelete
                        @click="() => setDeleteElement(category.id)"
                        data-bs-toggle="modal" 
                        data-bs-target="#deleteModal"
                        class="iconLink" 
                        style="width: 2rem; height: 2rem; color: var(--main-dark-1)" />
                </div>
            </div>
        </div>

        <div v-if="alertErrorFlag" :class="alertErrorClass" role="alert">
            {{ alertErrorText }}
        </div>

    </div>

    <div class="pagination-buttons">
        <button v-if="currentPage > 1" @click="fetchCategories(currentPage - 1)">Anterior</button>
        <button v-for="page in totalPages" :key="page" @click="fetchCategories(page)">{{ page }}</button>
        <button v-if="currentPage < totalPages" @click="fetchCategories(currentPage + 1)">Siguiente</button>
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

.divAddComp{
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

.categoryName{
    color: var(--text-dark-1);
}

.categoryName:hover{
    color: var(--main-color-light);
    transition: 0.4s;
}
</style>


