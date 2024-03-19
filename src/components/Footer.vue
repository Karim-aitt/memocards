<script setup>
import { RouterLink } from 'vue-router'



</script>

<template>
    <hr class="my-3 mt-5 py-3 border-2 text-secondary separator">
    <div class="container-fluid mx-3 my-3 py-4">



        <RouterLink to="/" class="navbar-brand fw-semibold h1Footer d-flex justify-content-center">
            Memocards
        </RouterLink>
        <span class="d-flex justify-content-center copyright">2024 ©</span>


    </div>

</template>

<style scoped>
.h1Footer {
    color: var(--main-color);
    font-size: xx-large;
    font-family: "Madimi One", sans-serif;
    font-weight: 400;
    font-style: normal;
    opacity: 0.3;
}

.h1Footer:hover {
    color: var(--main-color);
}

.copyright{
    opacity: 0.3;
}
</style>