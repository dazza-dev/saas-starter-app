import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useI18nTranslation } from 'vuetify-app-kit';
import type { HeaderTitleType } from '@/core/types/common.type';
import type { BreadcrumbItem } from 'vuetify-app-kit';
import type { TableHeader } from '@dazzadev/vuetify-datatable';

export function useRolePageConfig() {
    const { t } = useI18n();

    const pageTitle = ref<HeaderTitleType>({ title: '' });
    const breadcrumbs = ref<BreadcrumbItem[]>([]);
    const headers = ref<TableHeader[]>([]);

    function setTranslations() {
        pageTitle.value = { title: t('roles.pageTitle'), subtitle: t('roles.pageSubtitle') };

        breadcrumbs.value = [
            { title: t('common.home'), disabled: false, href: '#' },
            { title: t('roles.pageTitle'), disabled: true, href: '#' }
        ];

        headers.value = [
            { title: t('roles.tableHeaderDisplayName'), align: 'start', key: 'displayName' },
            { title: t('roles.tableHeaderDescription'), align: 'start', key: 'description' },
            { title: t('roles.permissions'), align: 'start', key: 'permissions', sortable: false },
            { title: t('roles.tableHeaderActions'), align: 'end', key: 'actions', fixed: true, sortable: false }
        ];
    }

    useI18nTranslation(setTranslations);

    return { pageTitle, breadcrumbs, headers };
}
