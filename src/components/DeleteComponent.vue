<script setup>
import { ref } from 'vue';
import IconDelete from '@/components/icons/IconDelete.vue';

//Stores
import { useUserStore } from '@/stores/useUserStore';


//Referencia de stores
const userStore = useUserStore();

const idDeleteElement = ref()

function setDeleteElement(id) {
    idDeleteElement.value = id
}

async function deleteElement() {
    const id = idDeleteElement.value
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}cards/${id}`, {
            method: 'DELETE',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + userStore.userToken
            }
        })

        if (!response.ok) {
            alertErrorClass.value = "alert alert-danger"
            alertErrorText.value = 'Error al eliminar la carta';
            alertErrorFlag.value = true;
            throw new Error('Error response is not ok');
        } else {
            alertErrorClass.value = "alert alert-success"
            alertErrorText.value = 'Carta eliminada con éxito';
            alertErrorFlag.value = true;
            fetchDeckCards()

            setTimeout(() => {
                alertErrorFlag.value = false;
            }, 1000)
        }

    } catch (error) {
        console.error("Error al borrar la carta", error);
    }

}

</script>

<template>

    <IconDelete @click="() => setDeleteElement(card.id)" data-bs-toggle="modal" data-bs-target="#deleteModal"
        class="iconLink" style="width: 2rem; height: 2rem; color: var(--main-dark-1)" />

    <!-- DELETE MODAL -->
    <!-- Modal -->
    <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body d-flex flex-column py-5">
                    <p class="mx-auto">
                        ¿Desea eliminar el elemento para siempre?

                    </p>
                    <div class="d-flex justify-content-evenly">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Salir</button>
                        <button @click="() => deleteElement()" type="button" class="btn btn-danger"
                            data-bs-dismiss="modal">Eliminar</button>

                    </div>
                </div>
            </div>
        </div>
    </div>

</template>
