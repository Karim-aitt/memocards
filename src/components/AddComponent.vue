<script setup>

import AddCategoryComp from './AddCategoryComp.vue';

const props = defineProps({
    pageName: String,
    formComponent: String,
})

console.log(props.formComponent)

</script>


<template>

    <button data-bs-toggle="modal" data-bs-target="#addModal">+</button>

    <!-- MODAL -->
    <div class="modal fade" id="addModal" tabindex="-1" aria-labelledby="addModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">

                <!-- HEADER -->
                <div class="modal-header">
                    <h1 class="modal-title fs-3" id="addModalLabel">Añadir {{ pageName }}</h1>
                    
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <!-- BODY -->
                <div class="modal-body">
                    
                    
                    <AddCategoryComp v-if="props.formComponent === 'AddCategoryComp'"/>

                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>