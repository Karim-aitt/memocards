import {
    ref
} from 'vue'
import {
    defineStore
} from 'pinia'

export const useFlagStore = defineStore('flag', () => {

    const flagCategory = ref(false);
    const flagDeck = ref(false);
    const flagCard = ref(false);
    const flagPlayMode = ref(false);
    const flagMobile = ref(false);

    function toggleFlagMobile(){
        console.log("antes",flagMobile.value)
        flagMobile.value = !flagMobile.value
        console.log("dsp",flagMobile.value)
    }

    function toggleFlagCategory() {
        flagCategory.value = !flagCategory.value;
    }

    function toggleFlagDeck() {
        flagDeck.value = !flagDeck.value;
    }

    function toggleFlagCard() {
        flagCard.value = !flagCard.value;
    }

    function toggleFlagPlayMode(){
        flagPlayMode.value = !flagPlayMode.value;
    }

    return {
        flagCategory,
        flagDeck,
        flagCard,
        flagMobile,
        toggleFlagDeck,
        toggleFlagCard,
        toggleFlagPlayMode,
        flagPlayMode,
        toggleFlagCategory,
        toggleFlagMobile
    };
})