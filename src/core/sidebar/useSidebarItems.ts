import { shallowRef, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import type { MenuItem } from 'vuetify-app-kit';
import ability from '@/core/plugins/ability';
import { useAuthStore } from '@/modules/authentication/stores/auth';
import type { SidebarItem } from '@/core/types/common.type';
import sidebarApp from './sidebarApp';

// One sidebar per module; `route.meta.module` decides which one renders.
const sidebarModules: Record<string, SidebarItem[]> = {
    app: sidebarApp
};

/**
 * Translates sidebar titles, which are declared as i18n keys.
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
 * Drops items without permission, and groups left without visible children.
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
        // permissionsLoaded is in the deps: the menu renders before permissions arrive.
        [() => route.meta.module as string, locale, () => authStore.permissionsLoaded],
        ([module]) => {
            const translated = translateItems(sidebarModules[module] ?? [], t);
            sidebarItems.value = filterByPermission(translated);
        },
        { immediate: true }
    );

    return sidebarItems;
}
