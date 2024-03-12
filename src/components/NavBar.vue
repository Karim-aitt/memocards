<script setup>
import { RouterLink } from 'vue-router'

// TODO: Hacer funcion isMobile
const isMobile = false;

</script>

<template>
  <nav class="navbar navbar-expand-lg py-lg-5 ">
    <div class="container-fluid mx-3">
      <!-- TODO: Insertar icono -->
      <div class="d-inline-flex">
        <span class="mainIcon_1 top-0 start-0 ms-3"></span>
      </div>

      <RouterLink to="/" class="navbar-brand fw-semibold h1Header mx-auto justify-content-lg-start ms-lg-3">
        Memocards
      </RouterLink>

      <button 
        class="navbar-toggler" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarNav"
        aria-controls="navbarNav" 
        aria-expanded="false" 
        aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <RouterLink to="/" class="nav-link" aria-current="page">Home</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/categorias" class="nav-link" href="#">Categorias</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/mazos" class="nav-link" href="#">Mazos</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/about" class="nav-link">Contacto</RouterLink>
          </li>
        </ul>
      </div>
      <div v-if="!isMobile">
        <button class="btn btn-primary ms-4">Acceder</button>
      </div>
    </div>

  </nav>
  <hr class="my-3 py-3 border-3 text-secondary"/>

</template>

<style scoped>


nav{
  background-color: var(--background-dark);
}

.h1Header{
  color: var(--main-color);
  font-size: xx-large;
  font-family: "Madimi One", sans-serif;
  font-weight: 400;
  font-style: normal;
}

.h1Header:hover{
  color: var(--main-color);
}

.navbar-toggler{
  color: var(--main-color);
  border-color: var(--main-color);
}

.navbar-toggler-icon {
  filter: brightness(0) saturate(100%) invert(38%) sepia(65%) saturate(4467%) hue-rotate(227deg) brightness(103%) contrast(101%);
}

a{
  font-size: medium;
  color: var(--text-dark-1);
  font-weight: 500;
  margin: 0 10px;
}
a:active{
  color: var(--main-color);
}
a:hover{
  color: var(--text-dark-1);
}
a:focus{
  color: var(--text-dark-1);
}

.mainIcon_1{
  width: 30px;
  height: 40px;
  border: solid 5px var(--main-color);
  background-color: #dddddd;
  border-radius: 5px;
}

</style>