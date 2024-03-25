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

    function toggleFlagCategory() {
        flagCategory.value = !flagCategory.value;
    }

    function toggleFlagDeck() {
        flagDeck.value = !flagDeck.value;
    }

    function toggleFlagCard() {
        flagCard.value = !flagCard.value;
    }

    return {
        toggleFlagCategory,
        flagCategory,
        flagDeck,
        flagCard,
        toggleFlagDeck,
        toggleFlagCard
    };
})