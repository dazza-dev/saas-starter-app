import { FullLayout } from 'vuetify-app-kit';
import UsersRoutes from '@/modules/users/routes/UsersRoutes';

/**
 * Rutas del módulo principal de la aplicación. `meta.module` decide qué sidebar se pinta;
 * todas las rutas que compartan navegación deben declarar el mismo valor.
 */
const AppRoutes = {
    path: '/app',
    meta: {
        requiresAuth: true,
        module: 'app'
    },
    component: FullLayout,
    redirect: '/app/dashboard',
    children: [
        {
            name: 'app-dashboard',
            path: '/app/dashboard',
            component: () => import('@/modules/dashboard/views/DashboardIndex.vue'),
            meta: {
                requiresAuth: true,
                permission: 'read-dashboard'
            }
        },
        ...UsersRoutes
    ]
};

export default AppRoutes;
