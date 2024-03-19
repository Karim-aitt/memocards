import {
    ref,
    computed,
    watch
} from 'vue'
import {
    defineStore
} from 'pinia'

export const useUserStore = defineStore('user', () => {

    const userIdRef = ref(0);
    const usernameRef = ref('');
    const userEmailRef = ref('');
    const userRoleRef = ref('');
    const userToken = ref(localStorage.getItem('token') || null);

    function setToken(newToken){
        userToken.value = newToken
    }

    async function getUserCredentials() {

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}users/user`, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Authorization': 'Bearer ' + userToken.value
                }
            })

            if (!response.ok) {
                throw new Error('Token invalido')
            }

            const {
                id,
                username,
                email,
                role_name
            } = await response.json();

            userIdRef.value = id
            usernameRef.value = username
            userEmailRef.value = email
            userRoleRef.value = role_name

        } catch (error) {
            console.error('Error al obtener usuario', error)
        }


    }

    if (userToken.value !== null) {
        getUserCredentials()
    }

    function resetUser() {
        userIdRef.value = 0
        usernameRef.value = ''
        userEmailRef.value = ''
        userRoleRef.value = ''
    }

    function getUserId(){
        return userIdRef.value
    }

    return {
        userIdRef,
        usernameRef,
        userEmailRef,
        userToken,
        getUserCredentials,
        resetUser,
        setToken,
        getUserId
    }
})