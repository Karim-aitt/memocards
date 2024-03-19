import {
    ref,
    computed,
    watch
} from 'vue'
import {
    defineStore
} from 'pinia'


export const useDeckStore = defineStore('deck', () => {

    const selectedCategoryName = ref('');
    const selectedCategoryId = ref(null);
    const selectedDeckName = ref('');
    const selectedDeckId = ref(null);

    function setSelectedCategoryName(name) {
        selectedCategoryName.value = name;
    }

    function setSelectedCategoryId(id) {
        selectedCategoryId.value = id;
    }

    function setSelectedDeckName(name) {
        selectedDeckName.value = name;
    }

    function setSelectedDeckId(id) {
        selectedDeckId.value = id;
    }

    function getSelectedCategoryName(){
        return selectedCategoryName.value;
    }
    function getSelectedCategoryId(){
        return selectedCategoryId.value;
    }
    function getSelectedDeckName(){
        return selectedDeckName.value;
    }
    function getSelectedDeckId(){
        return selectedDeckId.value;
    }


    return {
        setSelectedCategoryName,
        setSelectedCategoryId,
        setSelectedDeckName,
        setSelectedDeckId,
        getSelectedCategoryId,
        getSelectedCategoryName,
        getSelectedDeckId,
        getSelectedDeckName
    };
})