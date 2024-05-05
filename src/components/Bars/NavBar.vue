<script setup>
import { computed, onBeforeMount, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/useAuthStore';
import { useUserStore } from '@/stores/useUserStore';
import { useFlagStore } from '@/stores/useFlagStore';

const authStore = useAuthStore();
const userStore = useUserStore();
const flagStore = useFlagStore();

// Componentes
import Login from '../Login.vue'
import Register from '../Register.vue'

const validToken = computed(() => authStore.flagToken);

// Borrar el token y salir
function logout() {
  authStore.logout();
  userStore.resetUser();
}

const admin = computed(() => userStore.userRoleRef)

const isMobile = computed(() => flagStore.flagMobile);

</script>

<template>
  <nav class="navbar navbar-expand-lg py-lg-5 ">
    <div class="container-fluid mx-lg-3">
      <!-- TODO: Insertar icono -->
      <div class="d-inline-flex">

        <v-icon v-if="isMobile" name="bi-files" scale="3" class="iconLink"
          style=" width: 3rem; height: 3rem; color: var(--main-color)" />

        <v-icon v-else name="bi-files" scale="3" class="iconLink"
          style=" width: 4rem; height: 4rem; color: var(--main-color)" />

      </div>

      <RouterLink v-if="isMobile" to="/" class="navbar-brand h1HeaderMobile mx-auto justify-content-lg-start ms-lg-3">
        Memocards
      </RouterLink>
      <RouterLink v-else to="/" class="navbar-brand fw-semibold h1Header mx-auto justify-content-lg-start ms-lg-3">
        Memocards
      </RouterLink>

      <button class="navbar-toggler " type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
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
            <RouterLink to="/about" class="nav-link">Sobre nosotros</RouterLink>
          </li>
          <li v-if="admin === 'admin'" class="nav-item">
            <RouterLink to="/admin" class="nav-link">Admin</RouterLink>
          </li>
          <li v-if="validToken" class="nav-item">
            <RouterLink to="/user" class="nav-link username">{{ userStore.usernameRef }}</RouterLink>
          </li>
          <li>
            <div v-if="flagStore.flagMobile">
              <button v-if="validToken" class="btn btn-primary ms-2 mt-2" @click="logout">Salir</button>
              <button v-else class="btn btn-primary ms-2 mt-2" data-bs-toggle="modal"
                data-bs-target="#registerModal">Acceder</button>
            </div>
          </li>
        </ul>
      </div>
      <div v-if="!flagStore.flagMobile">
        <button v-if="validToken" class="btn btn-primary ms-4" @click="logout">Salir</button>
        <button v-else class="btn btn-primary ms-4" data-bs-toggle="modal"
          data-bs-target="#registerModal">Acceder</button>
      </div>

    </div>

  </nav>

  <hr v-if="!flagStore.flagMobile" class="my-3 py-3 border-2 text-secondary separator" />

  <!-- MODAL -->
  <div class="modal fade" id="registerModal" tabindex="-1" aria-labelledby="registerModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">

        <!-- HEADER -->
        <div class="modal-header">
          <!-- <h1 class="modal-title fs-5" id="registerModalLabel">Registro</h1> -->
          <nav class="nav">
            <button class="nav-link active navlink" id="login-tab" data-bs-toggle="tab" data-bs-target="#login"
              type="button" role="tab" aria-controls="login" aria-selected="true">
              Login</button>

            <button class="nav-link navlink" id="register-tab" data-bs-toggle="tab" data-bs-target="#register"
              type="button" role="tab" aria-controls="register" aria-selected="false">
              Registro</button>
          </nav>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <!-- BODY -->
        <div class="modal-body">
          <!-- Tab panes -->
          <div class="tab-content" id="myTabContent">

            <div class="tab-pane fade show active" id="login" role="tabpanel" aria-labelledby="login-tab">
              <Login />
            </div>

            <div class="tab-pane fade" id="register" role="tabpanel" aria-labelledby="register-tab">
              <Register />
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>
nav {
  background-color: var(--background-dark);
}

.h1Header {
  color: var(--main-color);
  font-size: xx-large;
  font-family: "Madimi One", sans-serif;
  font-weight: 400;
  font-style: normal;
}

.h1HeaderMobile {
  color: var(--main-color);
  font-size:x-large;
  font-family: "Madimi One", sans-serif;
  font-weight: 400;
  font-style: normal;
}

.h1Header:hover {
  color: var(--main-color);
}

.navbar-toggler {
  color: var(--main-color);
  border-color: var(--main-color);
}

.navbar-toggler-icon {
  filter: brightness(0) saturate(100%) invert(38%) sepia(65%) saturate(4467%) hue-rotate(227deg) brightness(103%) contrast(101%);
}

a {
  font-size: medium;
  color: var(--text-dark-1);
  font-weight: 500;
  margin: 0 10px;
}

a:active {
  color: var(--main-color);
}

a:hover {
  color: var(--text-dark-1);
}

a:focus {
  color: var(--text-dark-1);
}


.navlink {
  color: var(--text-dark-1);
  border: 1px solid var(--border-color);
  border-radius: 5px;
}

.navlink:last-child {
  margin-left: 10px;
}

.navlink:hover {
  background-color: #6466fa62;
  transition: 0.4s;
}

.navlink:focus {
  color: var(--main-color);
}
</style>
