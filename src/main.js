import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/main.scss'
import { registerIcons } from './icons'
import { initTheme } from './theme'

// Initialize theme before app mounts to avoid FOUC
initTheme()

const app = createApp(App)

// Globale icon-registratie
registerIcons(app)

app.use(router)
app.mount('#app')
