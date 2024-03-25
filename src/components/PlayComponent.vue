<script setup>
//Servicio
import { truncateText } from '../services/viewServices.js';

import IconFlip from "./icons/IconFlip.vue"

import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/useAuthStore';

const props = defineProps({
    cards: Array,
})

const arrayCards = ref([...props.cards]);

const inputAnswerRef = ref(null);

const authStore = useAuthStore();
const validToken = computed(() => authStore.flagToken);

const longitudMazo = ref(arrayCards.value.length - 1);
const cardIndexToShow = ref(0);

//Para la funcion de voltear la carta
const flagToggleSolution = ref(false);

const classInputAnswer = ref('form-control inputAnswer')

const classBodyCardAnimated = ref('cardBody d-flex flex-column border border-1 border-secondary rounded p-3 text-center mx-auto')

//Valor del input de la respuesta del usuario
const inputUserAnswer = ref('');
//Valor de la solucion de la carta actual
const solution = ref('');

//Para cuando se comprueba con el boton si la respuesta coincide con la solucion
const flagSuccess = ref(false);
const flagBadAnswer = ref(false);



function restarIndice() {
    if (cardIndexToShow.value !== 0) {
        cardIndexToShow.value--;
        flagSuccess.value = false;
        classInputAnswer.value = 'form-control inputAnswer';
    }
}

function sumarIndice() {
    if (cardIndexToShow.value < longitudMazo.value) {
        cardIndexToShow.value++;
        flagSuccess.value = false;
        classInputAnswer.value = 'form-control inputAnswer';
    }
}
function toggleSolution() {
    classBodyCardAnimated.value = 'cardBody d-flex flex-column border border-1 border-secondary rounded p-3 text-center mx-auto animate__animated animate__flipInY'
    flagToggleSolution.value = !flagToggleSolution.value

    setTimeout(() => {
        classBodyCardAnimated.value = 'cardBody d-flex flex-column border border-1 border-secondary rounded p-3 text-center mx-auto'
    }, 600)
}
function checkAnswer() {
    const currentSolution = arrayCards.value[cardIndexToShow.value].back_text;

    if (inputUserAnswer.value.toLowerCase() === currentSolution.toLowerCase()) {
        flagSuccess.value = true;
        classInputAnswer.value = 'form-control is-valid inputAnswer';
        classBodyCardAnimated.value = 'cardBody d-flex flex-column correctBorder rounded p-2 text-center mx-auto animate__animated animate__bounceOut'
        setTimeout(() => {
            classBodyCardAnimated.value = 'cardBody d-flex flex-column border border-1 border-secondary rounded p-3 text-center mx-auto'
        }, 1000)

        setTimeout(() => {
            removeCorrectCard(cardIndexToShow.value);
            inputUserAnswer.value = '';
            inputAnswerRef.value.focus()
            classInputAnswer.value = 'form-control inputAnswer';
            if (cardIndexToShow.value < arrayCards.value.length) {
            } else {
                cardIndexToShow.value = Math.max(0, arrayCards.value.length - 1);
            }
        }, 1000);

    } else {
        flagSuccess.value = false;
        classInputAnswer.value = 'form-control is-invalid inputAnswer';
        classBodyCardAnimated.value = 'cardBody d-flex flex-column border border-4 border-danger border-secondary rounded p-3 text-center mx-auto animate__animated animate__wobble'
        
        setTimeout(() => {
            classBodyCardAnimated.value = 'cardBody d-flex flex-column border border-1 border-secondary rounded p-3 text-center mx-auto'
        }, 1000)

        setTimeout(() => {
            removeWrongCard(cardIndexToShow.value);
            
            
            inputUserAnswer.value = '';
            inputAnswerRef.value.focus()
            classInputAnswer.value = 'form-control inputAnswer';
            if (cardIndexToShow.value < arrayCards.value.length) {
            } else {
                cardIndexToShow.value = Math.max(0, arrayCards.value.length - 1);
            }
        }, 1000);

    }
}
const correctCards = ref([]);
const wrongCards = ref([]);

function removeCorrectCard(index) {
    
    correctCards.value.push(arrayCards.value.splice(index, 1)[0]);
    longitudMazo.value--;
}   

function removeWrongCard(index) {
    
    wrongCards.value.push(arrayCards.value.splice(index, 1)[0]);
    longitudMazo.value--;
    
}

function resetCards() {
    arrayCards.value = [...props.cards];
    correctCards.value = [];
    wrongCards.value = [];
    longitudMazo.value = arrayCards.value.length - 1;
    cardIndexToShow.value = 0;
}

function repeatWrongCards() {
    arrayCards.value = [...wrongCards.value];
    wrongCards.value = [];
    correctCards.value = [];
    longitudMazo.value = arrayCards.value.length - 1;
    cardIndexToShow.value = 0;
}

const allCardsCompleted = computed(() => {
    return arrayCards.value.length === 0;
});

</script>

<template>
    <!-- <hr class="mt-5 py-3 border-2 text-secondary separator"> -->

    <div class="text-center mb-4">
        <p class="w-50 mx-auto fs-3" v-if="allCardsCompleted">Has completado todas las cartas. </p>
        <h3 v-else> Cartas restantes: {{ longitudMazo + 1 }}</h3>
        <p class="w-50 mx-auto fs-2" v-if="allCardsCompleted && wrongCards.length > 0">¿Quieres repetir las falladas?
        </p>
        <button @click="repeatWrongCards" class="btn btn-primary"
            v-if="allCardsCompleted && wrongCards.length > 0">Repetir falladas</button>


    </div>
    <div v-if="!allCardsCompleted" class="container-fluid mt-2 ">


        <div :class="classBodyCardAnimated">

            <p v-if="flagToggleSolution" class="fs-2 mx-auto my-auto text-success d-flex flex-wrap">

                {{ arrayCards[cardIndexToShow].back_text }}
            </p>
            <p v-else class="fs-2 mx-auto my-auto">
                {{ arrayCards[cardIndexToShow].front_text }}
            </p>

            <div class="d-flex justify-content-between">
                <IconFlip @click="toggleSolution" class=" ms-auto iconLink"
                    style="width: 2rem; height: 2rem; color: var(--text-light-1)" />
            </div>
        </div>


    </div>

    <div v-if="!allCardsCompleted" class="container-fluid mt-3 d-flex justify-content-evenly align-items-center">

        <div class="mt-5 d-flex">
            <!-- BUTTON DERECHA -->
            <button class="btn btn-secondary fw-bold me-5" @click="restarIndice">
                < 
            </button>

            <!-- USER INPUT Y BUTTON DE CHECK -->
            <input ref="inputAnswerRef" v-model="inputUserAnswer" type="text" placeholder="Respuesta"
                :class="classInputAnswer" />
            <button class="ms-3 btn btn-primary" @click="checkAnswer(cardIndexToShow)">Comprobar</button>

            <!-- BUTTON i<quierda -->
            <button class="btn btn-secondary fw-bold ms-5" @click="sumarIndice">
                >
            </button>


        </div>

    </div>

    <div v-if="!allCardsCompleted"
        class="d-flex border border-2 rounded  p-4 mt-5 mx-auto flex-wrap w-75 divCorrectCards">
        <div v-for="card in wrongCards" class="p-3 border border-3 rounded correctCard me-2 my-2 fw-semibold">
            {{ truncateText(card.front_text, 3) }}
        </div>
    </div>

    <div class="mt-4 d-flex justify-content-end mt-5 ">
        <button class="btn btn-secondary me-3" @click="resetCards">Reset</button>

    </div>



</template>

<style scoped>
.divCorrectCards {
    border-color: var(--border-color) !important;
}

.correctBorder{
    border: 10px solid green !important;
    border-radius: 15px !important;
}

.correctCard {
    color: var(--text-light-1);
    background-color: var(--text-dark-1);
    border-color: rgb(174, 49, 49) !important;
}

.cardBody {
    min-width: 300px;
    max-width: 400px;
    height: 300px;
    background-color: var(--text-dark-1);
    color: var(--text-light-1);
    box-shadow: 10px 10px 0 var(--text-light-1);
}

.inputAnswer {
    width: 250px;
}
</style>
