const GroupsRoutes = [
    {
        name: 'configs-groups',
        path: '/configs/groups',
        component: () => import('../views/GroupList.vue'),
        meta: { requiresAuth: true, permission: 'read-groups' }
    }
];

export default GroupsRoutes;
