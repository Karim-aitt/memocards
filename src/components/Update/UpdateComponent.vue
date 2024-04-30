<script setup>

import UpdateCategoryComp from './UpdateCategoryComp.vue';
import UpdateDeckComp from './UpdateDeckComp.vue';
import UpdateCardComp from './UpdateCardComp.vue';

const props = defineProps({
    pageName: String,
    formComponent: String,
    elementId: Number,
    elementValues: Object
})

</script>


<template>
    
    <!-- MODAL -->
    <div class="modal fade" id="updateModal" tabindex="-1" aria-labelledby="updateModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">

                <!-- HEADER -->
                <div class="modal-header">
                    <h1 class="modal-title fs-3" id="updateModalLabel">Actualizar {{ pageName }}</h1>
                    
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <!-- BODY -->
                <div class="modal-body">
                
                    <UpdateCategoryComp v-if="props.formComponent === 'UpdateCategoryComp'" :elementId="props.elementId" />
                    <UpdateDeckComp v-if="props.formComponent === 'UpdateDeckComp'" :elementId="props.elementId" />
                    <UpdateCardComp v-if="props.formComponent === 'UpdateCardComp'" :elementId="props.elementId" :elementValues="props.elementValues"/>

                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>