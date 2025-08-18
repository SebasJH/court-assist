// src/icons.js
import { Copy, Pencil, Trash, ArrowLeftToLine, ArrowRightToLine, TrafficCone, Dumbbell, ClipboardList, Shirt, Repeat2, Ellipsis, X, Users, TimerReset, Zap, Shield, BicepsFlexed, Crown, Medal, Trophy, Eye, Gauge, Speech, Target, Hourglass, Star } from 'lucide-vue-next'

export function registerIcons(app) {
    // UI icons from Lucide
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

    app.component('Shield', Shield)
    app.component('Target', Target)
    app.component('BicepsFlexed', BicepsFlexed)
    app.component('Crown', Crown)
    app.component('Medal', Medal)
    app.component('Trophy', Trophy)
    app.component('Eye', Eye)
    app.component('Gauge', Gauge)
    app.component('Speech', Speech)
    app.component('Hourglass', Hourglass)
    app.component('Star', Star)

}
