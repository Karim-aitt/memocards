import {
    ref,
    computed,
    watch
} from 'vue'
import {
    defineStore
} from 'pinia'

export const useFlagStore = defineStore('flag', () => {

    const flagCategory = ref(false);

    function toggleFlagCategory(){
        console.log("toggle 1", flagCategory.value)
        flagCategory.value = !flagCategory.value;
        console.log("toggle 2", flagCategory.value)
    }

    return {toggleFlagCategory, flagCategory};
})