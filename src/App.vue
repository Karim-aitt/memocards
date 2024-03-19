<script setup>
import { RouterView, useRoute } from 'vue-router'
import { ref } from 'vue';
import NavBar from './components/NavBar.vue';
import Sidebar from './components/Sidebar.vue';
import Footer from './components/Footer.vue';

const route = useRoute()

const isMobile = ref(false)

</script>

<template>
  <div v-if="route.path == '/'">

    <header>
      <NavBar />
    </header>


    <div>
      <RouterView />
      <Footer />
    </div>
  </div>

  <div v-else class="d-flex flex-column flex-md-row">
    <header>
      <Sidebar v-if="isMobile === false" />
      <NavBar v-else />
    </header>

    <hr v-if="isMobile === false" class="sidebarBorder my-4 mx-2 border border-1 bg-secondary separator">
    <div class="container-fluid m-3">
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
