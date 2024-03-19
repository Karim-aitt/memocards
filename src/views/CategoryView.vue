<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { RouterView, useRoute, RouterLink } from 'vue-router'

import AddComponent from '@/components/AddComponent.vue';

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

const flagCategory = computed(() => flagStore.flagCategory);

const validToken = computed(() => authStore.flagToken);
const userId = computed(() => userStore.userIdRef);

const categories = ref([])
const flagSpinner = ref(true);

async function fetchCategories() {

    try {
        
        const response = await fetch(`${import.meta.env.VITE_API_URL}category`)
        if (!response.ok) {
            throw new Error('Error en fetch categories')
        }
        categories.value = await response.json();

        //Para quitar el spinner después de 1 segundo
        setTimeout(() => {
            flagSpinner.value = false;

        }, 1000);

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
                'Authorization': 'Bearer ' + authStore.token
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
        fetchCategories();

    }, 200)
})

watch(flagCategory, () => {
    fetchCategories()
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
                            <button class="nav-link active text-link rounded-4" @click="fetchCategories">Comunidad</button>
                        </li>
                        <li v-if="validToken" class="nav-item">
                            <button class="nav-link text-link rounded-4 ms-2" @click="fetchUserCategories">Creadas</button>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="col-lg-4">
                <div class="d-lg-flex justify-content-end">
                    <input class="form-control w-75" type="text" placeholder="Nombre categoria..." />
                </div>
            </div>
        </div>

    </div>

    <div class="container-fluid mt-5">

        <div v-if="flagSpinner" class="spinner-border mx-auto fs-2" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>

        <div v-else class="d-flex justify-content-between flex-wrap">
            <div v-for="category in categories" :key="category.id" class="
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
                <IconCategory style="width: 2rem; height: 2rem; color: var(--main-color)"/>
                <RouterLink :to="`/mazos/${category.id}/${category.name}`" @click="deckStore.setSelectedCategoryId(category.id)" 
                class="ms-4 text-decoration-none categoryName">{{ category.name }}</RouterLink>

                <div v-if="userId === category.created_by_user_id" class="ms-auto me-3">
                    <IconPencil class="me-3 iconLink" style="width: 2rem; height: 2rem; color: var(--main-dark-1)" />
                    <IconDelete class="iconLink" style="width: 2rem; height: 2rem; color: var(--main-dark-1)" />
                </div>
            </div>
        </div>

        <AddComponent pageName="Categoria" formComponent="AddCategoryComp"/>

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

.categoryName{
    color: var(--text-dark-1);
}

.categoryName:hover{
    color: var(--main-color-light);
    transition: 0.4s;
}
</style>


