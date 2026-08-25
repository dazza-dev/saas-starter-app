import { HomeIcon, UsersIcon, SettingsIcon, PointIcon } from 'vue-tabler-icons';

import type { SidebarItem } from '@/core/types/common.type';

/**
 * Navigation for the `app` module; each item declares the permission it needs, and useSidebarItems drops the rest.
 */
const sidebarApp: SidebarItem[] = [
    {
        title: 'sidebar.home',
        icon: HomeIcon,
        to: '/app/dashboard',
        permission: 'read-dashboard'
    },
    {
        title: 'sidebar.users',
        icon: UsersIcon,
        to: '/app/users',
        permission: 'read-users'
    },
    {
        title: 'sidebar.configs',
        icon: SettingsIcon,
        children: [
            {
                title: 'sidebar.roles',
                icon: PointIcon,
                to: '/configs/roles',
                permission: 'read-roles'
            },
            {
                title: 'sidebar.groups',
                icon: PointIcon,
                to: '/configs/groups',
                permission: 'read-groups'
            },
            {
                title: 'sidebar.settings',
                icon: PointIcon,
                to: '/configs/settings',
                permission: 'read-config'
            }
        ]
    }
];

export default sidebarApp;
