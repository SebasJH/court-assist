import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/main.scss'
import './tailwind.scss'
import { registerIcons } from './icons'

const app = createApp(App)

// Globale icon-registratie
registerIcons(app)

app.use(router)
app.mount('#app')
