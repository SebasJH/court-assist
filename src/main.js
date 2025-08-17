import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/main.scss'
import './tailwind.scss'
import { registerIcons } from './icons'

import Slider from '@vueform/slider'
import '@vueform/slider/themes/default.css'

const app = createApp(App)

// Globale icon-registratie
registerIcons(app)

// Globale slider-registratie
app.component('Slider', Slider)

app.use(router)
app.mount('#app')
