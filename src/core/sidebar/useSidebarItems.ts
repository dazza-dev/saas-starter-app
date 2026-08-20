import { shallowRef, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import type { MenuItem } from 'vuetify-app-kit';
import ability from '@/core/plugins/ability';
import { useAuthStore } from '@/modules/authentication/stores/auth';
import type { SidebarItem } from '@/core/types/common.type';
import sidebarApp from './sidebarApp';

// Un sidebar por módulo; `route.meta.module` decide cuál se pinta.
const sidebarModules: Record<string, SidebarItem[]> = {
    app: sidebarApp
};

/**
 * Traduce los títulos del sidebar, que se declaran como claves i18n.
 */
function translateItems(items: SidebarItem[], t: (key: string) => string): SidebarItem[] {
    return items.map((item) => ({
        ...item,
        title: item.title ? t(item.title) : item.title,
        header: item.header ? t(item.header) : item.header,
        children: item.children ? translateItems(item.children, t) : undefined
    }));
}

/**
 * Descarta los items sin permiso, y los grupos que se quedan sin hijos visibles.
 */
function filterByPermission(items: SidebarItem[]): SidebarItem[] {
    return items
        .filter((item) => !item.permission || ability.can(item.permission, 'all'))
        .map((item) => (item.children ? { ...item, children: filterByPermission(item.children) } : item))
        .filter((item) => !item.children || item.children.length > 0);
}

export const sidebarItems = shallowRef<MenuItem[]>([]);

export function useSidebarItems() {
    const route = useRoute();
    const { t, locale } = useI18n();
    const authStore = useAuthStore();

    watch(
        // permissionsLoaded va en las dependencias: el menú se pinta antes de que lleguen los permisos.
        [() => route.meta.module as string, locale, () => authStore.permissionsLoaded],
        ([module]) => {
            const translated = translateItems(sidebarModules[module] ?? [], t);
            sidebarItems.value = filterByPermission(translated);
        },
        { immediate: true }
    );

    return sidebarItems;
}
