<script setup>

import IconUserGroupVue from "../components/icons/IconUserGroup.vue";
import IconInfiniteDecks from "../components/icons/IconInfiniteDecks.vue";
import IconFree from "../components/icons/IconFree.vue"
import IconRocket from "../components/icons/IconRocket.vue"

//Vue
import {computed} from 'vue';

//Pinia store
import { useAuthStore } from '@/stores/useAuthStore';
import { useFlagStore } from '@/stores/useFlagStore';

const authStore = useAuthStore();
const flagStore = useFlagStore();
const validToken = computed(() => authStore.flagToken);

const isMobile = computed(() => flagStore.flagMobile);

</script>

<template>
  <main class=" d-flex flex-column">
    <div class="d-flex flex-column flex-lg-row mb-5 container-fluid">
      <div class="col text-center mb-lg-0 mb-5 mt-3 mt-lg-0">
        <h2>
          Recuerda todo lo que quieras sin esfuerzo, a tu manera.
        </h2>
  
        <button
        v-if="!validToken"
        class="btn btn-primary mt-3 mt-lg-5 mx-4 py-3 px-5"
        type="button"
        data-bs-toggle="modal"
        data-bs-target="#registerModal"
        >
        Acceder</button>
  
      </div>
      <div class="container-fluid col d-flex justify-content-center ">
        <img src="@/assets/images/portada.jpg" alt="imagen" class="img-responsive"/>
      </div>

    </div>
    
    <div class="container-fluid d-flex flex-column flex-lg-row justify-content-between align-items-center mt-2 mt-lg-5">
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
  <hr class="my-lg-5 py-2 py-lg-3 border-2 text-secondary separator"/>

  <div class="d-flex justify-content-center text-center">
    <p v-if="isMobile" class="fs-6">Tarjetas de memoria <br> más rápidas, más fáciles </p>
    <p v-else class="fs-3">Tarjetas de memoria <br> más rápidas, más fáciles </p>
    <IconRocket v-if="isMobile" class="ms-2" style="width: 3rem; height: 3rem; color: var(--main-color);" />
    <IconRocket v-else class="ms-2" style="width: 4rem; height: 4rem; color: var(--main-color);" />
  </div>


</template>

<style scoped>
.img-responsive {
  max-width: 100%; 
  height: auto;
}

</style>

