import './assets/main.css'

import {createApp} from 'vue'
import {createPinia} from 'pinia'

// Importaciones para oh-vue-icons
import {OhVueIcon,addIcons} from 'oh-vue-icons'

import {BiFiles,BiLayersFill,BiLayersHalf,BiLayers} from 'oh-vue-icons/icons'

// Añade los iconos que necesites utilizar
addIcons(BiFiles,BiLayersFill,BiLayersHalf,BiLayers)

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Registra el componente OhVueIcon globalmente
app.component('v-icon', OhVueIcon)

app.mount('#app')