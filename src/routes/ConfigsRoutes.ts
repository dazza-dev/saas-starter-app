import { FullLayout } from 'vuetify-app-kit';
import GroupsRoutes from '@/modules/configs/groups/routes/GroupsRoutes';
import RolesRoutes from '@/modules/configs/roles/routes/RolesRoutes';
import { SettingsRoutes } from '@/modules/configs/settings/routes/SettingsRoutes';

const ConfigsRoutes = {
    path: '/configs',
    meta: {
        requiresAuth: true,
        // Configuración no tiene sidebar propio: reutiliza el del módulo principal.
        module: 'app'
    },
    component: FullLayout,
    redirect: '/configs/settings',
    children: [...GroupsRoutes, ...RolesRoutes, ...SettingsRoutes]
};

export default ConfigsRoutes;
