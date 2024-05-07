<script setup>
import { RouterView, useRoute } from 'vue-router'
import { onMounted, ref} from 'vue';

import NavBar from './components/Bars/NavBar.vue';
import Sidebar from './components/Bars/Sidebar.vue';
import Footer from './components/Bars/Footer.vue';

import { useFlagStore } from '@/stores/useFlagStore';

const flagStore = useFlagStore();
const route = useRoute()
const classMobile = ref('d-flex flex-column flex-lg-row')

//Conseguir el tamaño de la pantalla
const screenWidth = ref(window.innerWidth);

//Manejar la versión móvil o escritorio en base al tamaño de pantalla
function handleResize() {
  screenWidth.value = window.innerWidth;

  if (screenWidth.value < 992 && !flagStore.flagMobile) {
    flagStore.toggleFlagMobile();
    // console.log("resize: mobile");
  } else if (screenWidth.value >= 992 && flagStore.flagMobile) {
    flagStore.toggleFlagMobile();
    // console.log("resize: desktop");
  }
}
//Al cargar el componente (la página) comprueba si es versión escritorio o no
onMounted(() => {
  if (screenWidth.value < 992) {
    flagStore.toggleFlagMobile();
    // console.log("onMounted: mobile");
  } else {
    // console.log("onMounted: desktop");
  }
});

// Asociar la función handleResize al evento de cambio de tamaño
window.addEventListener('resize', handleResize);
</script>

<template>
  <div v-if="route.path == '/' || route.path == '/about'">

    <header>
      <NavBar />
    </header>


    <div>
      <RouterView />
      <Footer />
    </div>
  </div>

  <div v-else :class="classMobile">
    <header>
      <Sidebar v-if="flagStore.flagPlayMode === false && flagStore.flagMobile === false" />
      <NavBar v-if="flagStore.flagMobile === true" />
    </header>

    
    
    <div class="container-fluid m-lg-3">
      <RouterView />
      
    </div>
  </div>
</template>

<style scoped>

@media (max-width: 300px){
  .sidebarBorder{
    display: none;
  }
}

.sidebarBorder{
  position: relative;
  height: 90vh;
}

</style>
