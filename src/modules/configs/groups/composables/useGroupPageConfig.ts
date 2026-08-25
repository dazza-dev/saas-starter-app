import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useI18nTranslation } from 'vuetify-app-kit';
import type { HeaderTitleType } from '@/core/types/common.type';
import type { BreadcrumbItem } from 'vuetify-app-kit';
import type { TableHeader } from '@dazzadev/vuetify-datatable';

export function useGroupPageConfig() {
    const { t } = useI18n();

    const pageTitle = ref<HeaderTitleType>({ title: '' });
    const breadcrumbs = ref<BreadcrumbItem[]>([]);
    const headers = ref<TableHeader[]>([]);

    function setTranslations() {
        pageTitle.value = { title: t('groups.pageTitle'), subtitle: t('groups.pageSubtitle') };

        breadcrumbs.value = [
            { title: t('common.home'), disabled: false, href: '#' },
            { title: t('groups.pageTitle'), disabled: true, href: '#' }
        ];

        headers.value = [
            { title: t('groups.tableHeaderName'), align: 'start', key: 'name' },
            { title: t('groups.tableHeaderActions'), align: 'end', key: 'actions', fixed: true, sortable: false }
        ];
    }

    useI18nTranslation(setTranslations);

    return { pageTitle, breadcrumbs, headers };
}
