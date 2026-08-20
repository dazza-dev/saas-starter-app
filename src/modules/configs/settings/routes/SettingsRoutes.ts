export const SettingsRoutes = [
    {
        path: '/configs/settings',
        name: 'configs-settings',
        component: () => import('../views/SettingsView.vue'),
        meta: { requiresAuth: true, module: 'app', permission: 'read-config' }
    }
];
