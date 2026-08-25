<template>
    <PageHeader :title="pageTitle.title" :subtitle="pageTitle.subtitle" />

    <v-row>
        <v-col v-for="card in cards" :key="card.to" cols="12" sm="6" lg="3">
            <RouterLink :to="card.to" class="text-decoration-none">
                <ParentCard>
                    <div class="d-flex align-center ga-4">
                        <div class="rounded-circle pa-3 bg-lightprimary d-flex align-center justify-center">
                            <component :is="card.icon" size="24" class="text-primary" />
                        </div>
                        <div>
                            <div class="text-h6">{{ $t(card.title) }}</div>
                            <div class="text-subtitle-2 text-medium-emphasis">{{ $t(card.description) }}</div>
                        </div>
                    </div>
                </ParentCard>
            </RouterLink>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { UsersIcon, ShieldLockIcon, UsersGroupIcon, SettingsIcon } from 'vue-tabler-icons';
import ability from '@/core/plugins/ability';
import type { HeaderTitleType } from '@/core/types/common.type';

const { t } = useI18n();

const pageTitle = computed<HeaderTitleType>(() => ({
    title: t('dashboard.pageTitle'),
    subtitle: t('dashboard.pageSubtitle')
}));

// Replace these cards with your SaaS's real metrics.
const allCards = [
    { icon: UsersIcon, title: 'sidebar.users', description: 'dashboard.usersDescription', to: '/app/users', permission: 'read-users' },
    {
        icon: ShieldLockIcon,
        title: 'sidebar.roles',
        description: 'dashboard.rolesDescription',
        to: '/configs/roles',
        permission: 'read-roles'
    },
    {
        icon: UsersGroupIcon,
        title: 'sidebar.groups',
        description: 'dashboard.groupsDescription',
        to: '/configs/groups',
        permission: 'read-groups'
    },
    {
        icon: SettingsIcon,
        title: 'sidebar.settings',
        description: 'dashboard.settingsDescription',
        to: '/configs/settings',
        permission: 'read-config'
    }
];

const cards = computed(() => allCards.filter((card) => ability.can(card.permission, 'all')));
</script>
