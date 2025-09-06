import { createRouter, createWebHistory } from 'vue-router'
import ExercisesPage from '../views/ExercisePage.vue'
import TrainingsPage from '../views/TrainingsPage.vue'
import ExerciseDetail from '../views/ExerciseDetail.vue'
import ExerciseEdit from '../views/ExerciseEdit.vue'
import PlayEditorPage from '../views/PlayEditorPage.vue'
import TrainingDetail from '../views/TrainingDetail.vue'

const routes = [
    { path: '/', redirect: '/oefeningen' },
    { path: '/oefeningen', component: ExercisesPage },
    { path: '/oefeningen/nieuw', component: ExerciseEdit },
    { path: '/oefening/:slug/bewerken', component: ExerciseEdit },
    { path: '/trainingen', component: TrainingsPage },
    { path: '/training/:slug', component: TrainingDetail },
    { path: '/oefening/:slug', component: ExerciseDetail },
    { path: '/play-editor', name: 'PlayEditor', component: PlayEditorPage, meta: { bypassUnsavedGuard: true } }
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