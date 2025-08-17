// src/icons.js
import { Ellipsis, Users, TimerReset, Zap } from 'lucide-vue-next'

export function registerIcons(app) {
    app.component('Ellipsis', Ellipsis)
    app.component('Users', Users)
    app.component('TimerReset', TimerReset)
    app.component('Zap', Zap)
}
