// src/icons.js
import {
    Copy,
    Pencil,
    Trash,
    Star,

    ArrowLeft,
    ArrowLeftToLine,
    ArrowRightToLine,
    ArrowUpToLine,
    ArrowUpDown,
    ArrowUp,
    ChevronLeft,

    TrafficCone,
    Dumbbell,
    ClipboardList,
    CalendarDays,
    Shirt,
    Repeat2,

    Ellipsis,
    X,
    Users,
    TimerReset,
    Zap,
    Tag,
    Shapes,
    Text,

    Shield,
    BicepsFlexed,
    Crown,
    Medal,
    Trophy,
    Eye,
    Gauge,
    Activity,
    Speech,
    Target,
    Hourglass,
    Filter,
    Search,
    LayoutGrid,
    List,
    RectangleCircle,
    Menu,
    Plus,
    MoreVertical
   }
    from 'lucide-vue-next'

export function registerIcons(app) {
    // UI icons from Lucide
    app.component('Copy', Copy)
    app.component('Pencil', Pencil)
    app.component('Trash', Trash)
    app.component('Star', Star)

    app.component('ArrowLeft', ArrowLeft)
    app.component('ArrowLeftToLine', ArrowLeftToLine)
    app.component('ArrowRightToLine', ArrowRightToLine)
    app.component('ArrowUpToLine', ArrowUpToLine)
    app.component('ArrowUpDown', ArrowUpDown)
    app.component('ArrowUp', ArrowUp)
    app.component('ChevronLeft', ChevronLeft)

    app.component('TrafficCone', TrafficCone)
    app.component('Dumbbell', Dumbbell)
    app.component('ClipboardList', ClipboardList)
    app.component('CalendarDays', CalendarDays)
    app.component('Shirt', Shirt)
    app.component('Repeat2', Repeat2)

    app.component('Ellipsis', Ellipsis)
    app.component('X', X)
    app.component('Users', Users)
    app.component('TimerReset', TimerReset)
    app.component('Zap', Zap)
    app.component('Tag', Tag)
    app.component('Shapes', Shapes)
    app.component('Text', Text)

    app.component('Shield', Shield)
    app.component('Target', Target)
    app.component('BicepsFlexed', BicepsFlexed)
    app.component('Crown', Crown)
    app.component('Medal', Medal)
    app.component('Trophy', Trophy)
    app.component('Eye', Eye)
    app.component('Gauge', Gauge)
    app.component('Activity', Activity)
    app.component('Speech', Speech)
    app.component('Hourglass', Hourglass)
    app.component('Filter', Filter)
    app.component('Search', Search)
    app.component('LayoutGrid', LayoutGrid)
    app.component('List', List)
    app.component('Menu', Menu)
    app.component('Plus', Plus)
    app.component('MoreVertical', MoreVertical)
    
    // Custom local icons
    app.component('RectangleCircle', RectangleCircle)
    app.component('rectangleCircle', RectangleCircle)

}
