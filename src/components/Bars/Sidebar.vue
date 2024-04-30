<script setup>

import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/useAuthStore';
import { useUserStore } from '@/stores/useUserStore';

const authStore = useAuthStore();
const userStore = useUserStore();

const validToken = computed(() => authStore.flagToken);
const admin = computed(() => userStore.userRoleRef)
// Componentes
import Login from '../Login.vue'
import Register from '../Register.vue'

function logout() {
  authStore.logout();
  userStore.resetUser();
}

</script>

<template>

  <div class="container-fluid d-flex flex-column sidebarBorder rounded mt-3 p-4 ps-0" style="width: 230px;">

    <RouterLink to="/" class="d-flex">

      <v-icon label="Main logo" class="iconLink mx-auto my-5" animation="float" speed="slow"
        style=" width: 5rem; height: 5rem; color: var(--main-color)">
        
        <v-icon name="bi-files" scale="3" class="iconLink" />
      </v-icon>


    </RouterLink>


    <ul class="nav nav-pills flex-column mb-auto">
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

    </ul>

    <hr class="my-4 border border-1 bg-secondary separator">
    <RouterLink v-if="validToken" to="/user" class="nav-link username fs-3 mx-auto mb-3 px-3">
      {{ userStore.usernameRef }}
    </RouterLink>


    <button v-if="validToken" class="btn btn-primary mx-2" @click="logout">Salir</button>
    <button v-else class="btn btn-primary mx-2" data-bs-toggle="modal" data-bs-target="#registerModal">Acceder</button>



  </div>

  <!-- MODAL -->
  <div class="modal fade" id="registerModal" tabindex="-1" aria-labelledby="registerModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">

        <!-- HEADER -->
        <div class="modal-header">
          
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
.sidebarBorder {
  /* margin-top: 3rem;
  margin-bottom: 3rem;
  height: 90vh;
  border-right: 2px solid #94a3b83a; */
  background-color: var(--background-color);

  /* border: 2px solid var(--border-color); */
  /* box-shadow: 10px 10px 10px var(--background-dark-2); */
}

.h1Header {
  color: var(--main-color);
  font-size: xx-large;
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

/* MODAL CLASSES */

.modal-content {
  background-color: var(--background-dark);
}

.modal-header,
.modal-footer {
  background-color: var(--background-dark-2);
  border: none;
}

.btn-close {
  filter: brightness(153%) saturate(100%) invert(38%) sepia(35%) saturate(4167%) hue-rotate(227deg) brightness(203%) contrast(101%);

}

.modal-backdrop {
  opacity: 0;
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