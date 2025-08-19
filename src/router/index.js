import { createRouter, createWebHistory } from 'vue-router'
import ExercisesPage from '../views/ExercisePage.vue'
import TrainingsPage from '../views/TrainingsPage.vue'

const routes = [
    { path: '/', redirect: '/oefeningen' },
    { path: '/oefeningen', component: ExercisesPage },
    { path: '/trainingen', component: TrainingsPage },
    { path: '/oefening/:slug', component: () => import('../views/ExerciseDetail.vue') }
]

const router = createRouter({ history: createWebHistory(), routes })
export default router