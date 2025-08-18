// src/icons.js
import { Copy, Pencil, Trash, ArrowLeftToLine, ArrowRightToLine, TrafficCone, Dumbbell, ClipboardList, Shirt, Repeat2, Ellipsis, X, Users, TimerReset, Zap } from 'lucide-vue-next'

export function registerIcons(app) {
    app.component('Copy', Copy)
    app.component('Pencil', Pencil)
    app.component('Trash', Trash)

    app.component('ArrowLeftToLine', ArrowLeftToLine)
    app.component('ArrowRightToLine', ArrowRightToLine)

    app.component('TrafficCone', TrafficCone)
    app.component('Dumbbell', Dumbbell)
    app.component('ClipboardList', ClipboardList)
    app.component('Shirt', Shirt)
    app.component('Repeat2', Repeat2)

    app.component('Ellipsis', Ellipsis)
    app.component('X', X)
    app.component('Users', Users)
    app.component('TimerReset', TimerReset)
    app.component('Zap', Zap)
}
