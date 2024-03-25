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
    const selectedDeckIdCreator = ref(null);

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
    function setSelectedDeckIdCreator(id){
        console.log('selected', id)
        selectedDeckIdCreator.value = id;
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
    function getSelectedDeckIdCreator(){
        return selectedDeckIdCreator.value;
    }


    return {
        setSelectedCategoryName,
        setSelectedCategoryId,
        setSelectedDeckName,
        setSelectedDeckId,
        setSelectedDeckIdCreator,
        getSelectedCategoryId,
        getSelectedCategoryName,
        getSelectedDeckId,
        getSelectedDeckName,
        getSelectedDeckIdCreator
    };
})