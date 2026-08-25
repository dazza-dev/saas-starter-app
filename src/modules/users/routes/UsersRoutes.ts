const UsersRoutes = [
    {
        name: 'app-users',
        path: '/app/users',
        component: () => import('../views/UserList.vue'),
        meta: { requiresAuth: true, permission: 'read-users' }
    }
];

export default UsersRoutes;
