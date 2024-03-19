<script setup>

import IconPencil from "./icons/IconPencil.vue"
import IconFlip from "./icons/IconFlip.vue"

import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/useAuthStore';

const props = defineProps({
    cards: Array,
})

const authStore = useAuthStore();
const validToken = computed(() => authStore.flagToken);

const longitudMazo = props.cards.length - 1;
const cardIndexToShow = ref(0);

//Para la funcion de voltear la carta
const flagToggleSolution = ref(false);

const classInputAnswer = ref('form-control inputAnswer')

const classBodyCardAnimated = ref('cardBody d-flex flex-column border border-1 border-secondary rounded p-3')

//Valor del input de la respuesta del usuario
const inputUserAnswer = ref('');
//Valor de la solucion de la carta actual
const solution = ref('');

//Para cuando se comprueba con el boton si la respuesta coincide con la solucion
const flagSuccess = ref(false);
const flagBadAnswer = ref(false);

const arrayCorrectCards = ref([]);

function restarIndice() {
    if (cardIndexToShow.value !== 0) {
        cardIndexToShow.value--
        flagSuccess.value = false;
        classInputAnswer.value = 'form-control inputAnswer'
    } else {

        setTimeout(() => {
            //alerta de no hay mas cartas
        }, 1000)
    }
}
function sumarIndice() {
    if (cardIndexToShow.value < longitudMazo) {
        cardIndexToShow.value++
        flagSuccess.value = false;
        classInputAnswer.value = 'form-control inputAnswer'
    } else {
        //No hay mas cartas
    }
}
function toggleSolution() {
    classBodyCardAnimated.value = 'cardBody d-flex flex-column border border-1 border-secondary rounded p-3 animate__animated animate__flipInY'
    flagToggleSolution.value = !flagToggleSolution.value

    setTimeout(() => {
        classBodyCardAnimated.value = 'cardBody d-flex flex-column border border-1 border-secondary rounded p-3'
    }, 600)
}
function checkAnswer() {

    solution.value = props.cards[cardIndexToShow.value].back_text

    if (inputUserAnswer.value.toLowerCase() === solution.value.toLowerCase()) {
        flagSuccess.value = true;
        arrayCorrectCards.value.push(props.cards[cardIndexToShow.value].id);
        classInputAnswer.value = 'form-control is-valid inputAnswer'

        setTimeout(() => {
            sumarIndice();

        }, 1000)

    } else {
        //Respuesta incorrecta
        console.log("No es correcto");
        classInputAnswer.value = 'form-control is-invalid inputAnswer'
    }
}


</script>

<template>
    <div class="text-center">
        <h3 class="">{{cardIndexToShow + 1}} / {{ longitudMazo + 1 }}</h3>
    </div>
    <div class="container-fluid mt-2 d-flex justify-content-evenly align-items-center">


        <button class="btn btn-primary fs-1" @click="restarIndice">
            < 
        </button>


                <div>
                    <div :class="classBodyCardAnimated">

                        <p v-if="flagToggleSolution" class="fs-1 mx-auto my-auto text-success">
                           
                            {{ props.cards[cardIndexToShow].back_text }}
                        </p>
                        <p v-else class="fs-1 mx-auto my-auto">
                            {{ props.cards[cardIndexToShow].front_text }}
                        </p>

                        <div class="d-flex justify-content-between mt-auto">
                            <IconPencil class="iconLink" style="width: 2rem; height: 2rem; color: var(--text-light-1)"/>
                            <IconFlip @click="toggleSolution" class="iconLink" style="width: 2rem; height: 2rem; color: var(--text-light-1)"/>
                        </div>
                    </div>

                </div>


                <button class="btn btn-primary fs-1" @click="sumarIndice">
                    >
                </button>
    </div>

    <div class="container-fluid mt-3 d-flex justify-content-evenly align-items-center">
        <div class="mt-5 d-flex">
            <input v-model="inputUserAnswer" type="text" placeholder="Respuesta" :class="classInputAnswer" />
            <button class="ms-3 btn btn-primary" @click="checkAnswer">Comprobar</button>
        </div>
    </div>
</template>

<style scoped>
.cardBody {
    min-width: 300px;
    height: 300px;
    background-color: var(--text-dark-1);
    color: var(--text-light-1);
    box-shadow: 10px 10px 0 var(--text-light-1);
}

.inputAnswer {
    width: 250px;
}
</style>import IconFreeVue from "./icons/IconFree.vue";
