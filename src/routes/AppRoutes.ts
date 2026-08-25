import { FullLayout } from 'vuetify-app-kit';
import UsersRoutes from '@/modules/users/routes/UsersRoutes';

/**
 * Main application module routes; routes sharing navigation must declare the same `meta.module`.
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
