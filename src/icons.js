// src/icons.js
import { Copy, Pencil, Trash, Ellipsis, X, Users, TimerReset, Zap } from 'lucide-vue-next'

export function registerIcons(app) {
    app.component('Copy', Copy)
    app.component('Pencil', Pencil)
    app.component('Trash', Trash) // Assuming Trash is an alias for Pencil
    app.component('Ellipsis', Ellipsis)
    app.component('X', X)
    app.component('Users', Users)
    app.component('TimerReset', TimerReset)
    app.component('Zap', Zap)
}
