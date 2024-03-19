<script setup>

import IconUserGroupVue from "../components/icons/IconUserGroup.vue";
import IconInfiniteDecks from "../components/icons/IconInfiniteDecks.vue";
import IconFree from "../components/icons/IconFree.vue"
import IconRocket from "../components/icons/IconRocket.vue"

//Vue
import {computed} from 'vue';

//Pinia store
import { useAuthStore } from '@/stores/useAuthStore';

const authStore = useAuthStore();
const validToken = computed(() => authStore.flagToken);



</script>

<template>
  <main class=" d-flex flex-column">
    <div class="d-flex flex-column flex-lg-row mb-5">
      <div class="col text-center mb-lg-0 mb-5">
        <h2>
          Recuerda todo lo que quieras sin esfuerzo, a tu gusto.
        </h2>
  
        <button
        v-if="!validToken"
        class="btn btn-primary mt-5 mx-4 py-3 px-5"
        type="button"
        data-bs-toggle="modal"
        data-bs-target="#registerModal"
        >
        Acceder</button>
  
      </div>
      <div class="col d-flex justify-content-center">
        <img alt="imagen" />
      </div>

    </div>
    
    <div class="container-fluid d-flex flex-column flex-lg-row justify-content-between align-items-center mt-5">
      <div class="d-flex align-items-center mb-4 mb-lg-0">
        <IconUserGroupVue class="me-3" style="width: 4rem; height: 4rem; color: var(--main-color)"/>
        <div>
          <h3 class="mb-0">100,000 +</h3>
          <p class="mb-0">Memorizadores</p>
        </div>
      </div>

      <div class="d-flex align-items-center mb-4 mb-lg-0">
        <IconInfiniteDecks class="me-3" style="width: 4rem; height: 4rem; color: var(--main-color)"/>
        <div>
          <h3 class="mb-0">Infinitos mazos</h3>
          <p class="mb-0">Crea todos los que quieras</p>
        </div>
      </div>

      <div class="d-flex align-items-center mb-4 mb-lg-0">
        <IconFree class="me-3" style="width: 4rem; height: 4rem; color: var(--main-color);" />
        <div>
          <h3 class="mb-0">Sin ningun coste</h3>
          <p class="mb-0">Gratuito siempre</p>
        </div>
      </div>

    </div>

  </main>
  <hr class="my-5 py-3 border-2 text-secondary separator"/>

  <div class="d-flex justify-content-center text-center">
    <h2 class="me-3">Tarjetas de memoria <br> más rápidas, más fáciles </h2>
    <IconRocket style="width: 4rem; height: 4rem; color: var(--main-color);" />
  </div>


</template>

<style scoped>


</style>

