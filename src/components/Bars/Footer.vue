<script setup>
import {computed} from 'vue'
import { RouterLink } from 'vue-router'
import { useFlagStore } from '@/stores/useFlagStore';
const flagStore = useFlagStore();
const isMobile = computed(() => flagStore.flagMobile);

</script>

<template>
    <hr class="my-lg-3 mt-lg-5 py-lg-3 border-2 text-secondary separator">
    <div class="container-fluid my-3 py-4">

        <RouterLink v-if="isMobile" to="/" class="navbar-brand fw-semibold mobileFooter  d-flex justify-content-center">
            Memocards
        </RouterLink>
        <RouterLink v-else to="/" class="navbar-brand fw-semibold h1Footer  d-flex justify-content-center">
            Memocards
        </RouterLink>
        <span class="d-flex justify-content-center copyright">2024 ©</span>

    </div>

</template>

<style scoped>
.mobileFooter{
    color: var(--main-color);
    font-size: x-large;
    font-family: "Madimi One", sans-serif;
    font-weight: 400;
    font-style: normal;
    opacity: 0.3;
}

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