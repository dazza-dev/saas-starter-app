import { BlankLayout } from 'vuetify-app-kit';

const AuthRoutes = {
    path: '/auth',
    component: BlankLayout,
    meta: {
        requiresAuth: false
    },
    children: [
        {
            name: 'login',
            path: '/auth/login',
            component: () => import('@/modules/authentication/views/SideLogin.vue')
        },
        {
            name: 'forgot-password',
            path: '/auth/forgot-password',
            component: () => import('@/modules/authentication/views/ForgotPassword.vue')
        },
        {
            name: 'reset-password',
            path: '/auth/reset-password',
            component: () => import('@/modules/authentication/views/ResetPassword.vue')
        },
        {
            name: 'auto-login',
            path: '/auth/auto-login',
            component: () => import('@/modules/authentication/views/AutoLogin.vue')
        },
        {
            name: 'Error',
            path: '/auth/404',
            component: () => import('@/modules/authentication/views/AuthError.vue')
        }
    ]
};

export default AuthRoutes;
