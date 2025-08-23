import { createRouter, createWebHistory } from 'vue-router'
import ExercisesPage from '../views/ExercisePage.vue'
import TrainingsPage from '../views/TrainingsPage.vue'
import ExerciseDetail from '../views/ExerciseDetail.vue'

const routes = [
    { path: '/', redirect: '/oefeningen' },
    { path: '/oefeningen', component: ExercisesPage },
    { path: '/trainingen', component: TrainingsPage },
    { path: '/oefening/:slug', component: ExerciseDetail }
]

const router = createRouter({ history: createWebHistory(), routes })

// Global error handling
router.onError((error) => {
    console.error('Router error:', error)
    // Redirect naar oefeningen pagina bij router errors
    if (error.message.includes('Failed to fetch dynamically imported module')) {
        router.push('/oefeningen')
    }
})

export default router