import {ref, computed, watchEffect} from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  //Consigue el token de localStorage
  const token = ref(localStorage.getItem('token') || null);
  //Flag de un token valido
  const flagToken = ref(false);

  //Funcion para comprobar si el token encontrado es valido (el user esta logueado)
  async function userIsLogged() {
    const tokenIsValid = await validateToken();
    //validateToken devuelve true o false
    flagToken.value = tokenIsValid;
  }

  async function validateToken() {
    const checkToken = token.value
    if (!checkToken) return false;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}users/verify`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({token: checkToken})
      })

      if (!response.ok) {
        throw new Error('Token invalido');
      }

      //Convierte la respuesta a string
      const { token } = await response.json();

      //Si no hay token, return false
      if (!token) { return false }

      return true;

    } catch (error) {
      //Si hay un error en el fetch, borra el token y retorna false
      console.error('Error al validar token', error);
      logout();
      return false;
    }
  };

  const logout = () => {
    token.value = null;
    flagToken.value = false;
    localStorage.removeItem('token');
    // Aquí podrías incluir cualquier otra lógica de limpieza necesaria
  };

  watchEffect(() => {
    try {
      userIsLogged();
    } catch (error) {
      console.error('Error en watchEffect de useAuthStore', error);
    }
  });

  return {
    token,
    flagToken,
    userIsLogged,
    validateToken,
    logout
  };
})