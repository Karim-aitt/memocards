<script setup>
import { ref, onMounted, computed } from 'vue';
import { RouterView, useRoute, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore';
import { useUserStore } from '@/stores/useUserStore';
import { useDeckStore } from '@/stores/useDeckStore';

const deckStore = useDeckStore();
const authStore = useAuthStore();
const userStore = useUserStore();


const props = defineProps({
    cards: [],
    

})

const validToken = computed(() => authStore.flagToken);

const deckName = 

const cards = ref([])

onMounted(() => {
    
    setTimeout(() => {
        
    }, 500)
})



</script>

<template>
    <div class="container-fluid mt-5">

        <h1>Estoy jugando</h1>

    </div>
</template>

<style scoped>

</style>