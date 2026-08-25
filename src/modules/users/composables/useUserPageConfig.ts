import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useI18nTranslation } from 'vuetify-app-kit';
import type { HeaderTitleType } from '@/core/types/common.type';
import type { BreadcrumbItem } from 'vuetify-app-kit';
import type { TableHeader } from '@dazzadev/vuetify-datatable';

export function useUserPageConfig() {
    const { t } = useI18n();

    const pageTitle = ref<HeaderTitleType>({ title: '' });
    const breadcrumbs = ref<BreadcrumbItem[]>([]);
    const headers = ref<TableHeader[]>([]);

    function setTranslations() {
        pageTitle.value = { title: t('users.pageTitle'), subtitle: t('users.pageSubtitle') };

        breadcrumbs.value = [
            { title: t('common.home'), disabled: false, href: '#' },
            { title: t('users.pageTitle'), disabled: true, href: '#' }
        ];

        headers.value = [
            { title: t('users.tableHeaderName'), align: 'start', key: 'firstName' },
            { title: t('users.tableHeaderEmail'), align: 'start', key: 'email' },
            { title: t('users.tableHeaderRole'), align: 'start', key: 'roles', sortable: false },
            { title: t('users.tableHeaderStatus'), align: 'start', key: 'status' },
            { title: t('users.tableHeaderActions'), align: 'end', key: 'actions', fixed: true, sortable: false }
        ];
    }

    useI18nTranslation(setTranslations);

    return { pageTitle, breadcrumbs, headers };
}
