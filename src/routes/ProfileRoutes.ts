import { FullLayout } from 'vuetify-app-kit';

const ProfileRoutes = {
    path: '/profile',
    component: FullLayout,
    meta: { requiresAuth: true, module: 'app' },
    children: [
        {
            name: 'profile',
            path: '',
            component: () => import('@/modules/authentication/profile/views/ProfileView.vue'),
            meta: { requiresAuth: true }
        }
    ]
};

export default ProfileRoutes;
