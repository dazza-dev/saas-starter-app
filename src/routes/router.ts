import { createRouter, createWebHistory } from 'vue-router';
import { isAuthenticated } from '@/modules/authentication/utils/auth';

// Rutas del módulo principal
import AppRoutes from '@/routes/AppRoutes';

// Rutas de Configs
import ConfigsRoutes from '@/routes/ConfigsRoutes';

// Rutas de Authentication
import AuthRoutes from '@/routes/AuthRoutes';

// Rutas de Profile
import ProfileRoutes from '@/routes/ProfileRoutes';

//
import ability from '@/core/plugins/ability';
import { useAuthStore } from '@/modules/authentication/stores/auth';
import { useConfigStore } from '@/core/stores/config';

import { getTenantFromPath } from 'vuetify-app-kit';
import { ErrorPage } from 'vuetify-app-kit';
import type { RoutePermission } from '@/core/types/common.type';

// El tenant sale del primer segmento de la URL y es la base del router.
const tenant = getTenantFromPath();

const routes = tenant
    ? [
          {
              path: '/',
              redirect: '/auth/login'
          },

          // Rutas de Auth
          AuthRoutes,

          // Rutas del módulo principal
          AppRoutes,

          // Rutas de Configs
          ConfigsRoutes,

          // Rutas de Profile
          ProfileRoutes,

          {
              path: '/403',
              name: 'forbidden',
              component: () => import('@/core/views/ForbiddenView.vue'),
              meta: { requiresAuth: true }
          },
          { path: '/:pathMatch(.*)*', name: 'not-found', component: ErrorPage }
      ]
    : [
          // Sin tenant en la URL se entra por la pantalla que pregunta cuál es.
          {
              path: '/',
              name: 'tenant-select',
              component: () => import('@/modules/authentication/views/TenantSelect.vue')
          },
          { path: '/:pathMatch(.*)*', name: 'not-found', component: ErrorPage }
      ];

const router = createRouter({
    history: createWebHistory(tenant ? `/${tenant}/` : '/'),
    routes
});

// Si la configuración no carga, el tenant no existe: se muestra "no encontrado".
router.beforeEach(async (to) => {
    if (!tenant) return;
    if (to.name === 'not-found') return;

    const configStore = useConfigStore();
    if (!Object.keys(configStore.settings).length) {
        try {
            await configStore.getSettings();
        } catch {
            return {
                name: 'not-found',
                params: { pathMatch: to.path.replace(/^\/+/, '').split('/') }
            };
        }
    }

    if (!Object.keys(configStore.settings).length) {
        return {
            name: 'not-found',
            params: { pathMatch: to.path.replace(/^\/+/, '').split('/') }
        };
    }
});

// Redirige a la página de login si no hay sesión y se intenta acceder a una página restringida.
router.beforeEach(async (to) => {
    const publicPages = ['/auth/login'];
    const authRequired = !publicPages.includes(to.path);

    if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (authRequired && !(await isAuthenticated())) {
            return '/auth/login';
        }
    } else {
        if (to.path === '/auth/login' && (await isAuthenticated())) {
            return '/app/dashboard';
        }
    }
});

// Cada ruta declara en meta.permission el permiso que exige.
router.beforeEach(async (to) => {
    if (!tenant) return;
    if (to.path.startsWith('/auth/')) return;

    const authStore = useAuthStore();

    // Se cargan siempre: el sidebar y v-can los necesitan desde el primer render.
    if (!authStore.permissionsLoaded && (await isAuthenticated())) {
        try {
            await authStore.getPermissions();
        } catch {
            return '/auth/login';
        }
    }

    const meta = to.meta?.permission as RoutePermission | undefined;
    if (!meta) return;

    const permission = typeof meta === 'function' ? meta(to) : meta;
    if (!permission) return;

    if (ability.can(permission, 'all')) return;

    return { name: 'forbidden' };
});

export default router;
