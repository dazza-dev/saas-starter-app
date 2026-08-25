const RolesRoutes = [
    {
        name: 'configs-roles',
        path: '/configs/roles',
        component: () => import('../views/RoleList.vue'),
        meta: { requiresAuth: true, permission: 'read-roles' }
    },
    {
        name: 'configs-roles-permissions',
        path: '/configs/roles/:uuid/permissions',
        component: () => import('../views/RolePermissions.vue'),
        meta: { requiresAuth: true, permission: 'update-roles' }
    }
];

export default RolesRoutes;
