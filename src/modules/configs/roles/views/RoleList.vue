<template>
    <PageHeader :title="pageTitle.title" :subtitle="pageTitle.subtitle">
        <template v-slot:actions>
            <v-btn color="primary" flat @click="openCreateModal"> <v-icon class="mr-2">mdi-plus</v-icon> {{ $t('roles.newRole') }} </v-btn>
        </template>
    </PageHeader>
    <v-row>
        <v-col cols="12">
            <ParentCard>
                <template #header>
                    <div class="card-header-search">
                        <AppInput
                            v-model="search"
                            :label="$t('roles.searchRoles')"
                            density="compact"
                            clearable
                            prepend-inner-icon="mdi-magnify"
                        />
                    </div>
                </template>

                <DataTable
                    :headers="headers"
                    :items="items"
                    :loading="loading"
                    :search="search"
                    :totalItems="totalItems"
                    @onLoadData="loadData"
                    @editItem="editRole"
                    @deleteItem="handleDeleteRole"
                    :deleteButtonText="$t('common.delete')"
                    :deleteModalTitle="$t('roles.delete.modalTitle')"
                    :deleteModalConfirmButtonText="$t('common.confirmDelete')"
                    :deleteModalCancelButtonText="$t('common.cancel')"
                    :editButtonText="$t('common.edit')"
                >
                    <template v-slot:item.permissions="{ item }">
                        <v-btn v-can="'update-roles'" size="small" variant="tonal" color="primary" @click="goToPermissions(item)">
                            <v-icon size="small" class="mr-1">mdi-shield-key-outline</v-icon>
                            {{ $t('roles.permissions') }}
                        </v-btn>
                    </template>
                </DataTable>
            </ParentCard>
        </v-col>
    </v-row>

    <RoleForm v-model="dialogEdit" :roleUuid="roleUuid" @saved="refreshDatatable()" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useRole } from '../composables/useRole';
import { useRolePageConfig } from '../composables/useRolePageConfig';
import { notify } from '@/core/utils/common';
import { AppInput, DEFAULT_ITEMS_PER_PAGE, getErrorMessage } from 'vuetify-app-kit';
import type { Role } from '../types/Role';
import type { LoadDataParams } from '@dazzadev/vuetify-datatable';
import RoleForm from './RoleForm.vue';

const { t } = useI18n();
const router = useRouter();
const { roles: items, loading, totalItems, getRoles, deleteRole } = useRole();
const { pageTitle, headers } = useRolePageConfig();

const dialogEdit = ref(false);
const roleUuid = ref('');
const search = ref('');

function refreshDatatable() {
    loadData({ page: 1, itemsPerPage: DEFAULT_ITEMS_PER_PAGE });
}

function loadData(params: LoadDataParams) {
    getRoles({ page: params.page, itemsPerPage: params.itemsPerPage, search: search.value, sortBy: params.sortBy });
}

function openCreateModal() {
    roleUuid.value = '';
    dialogEdit.value = true;
}

function editRole(role: Role) {
    roleUuid.value = role.uuid;
    dialogEdit.value = true;
}

function goToPermissions(role: Role) {
    router.push({ name: 'configs-roles-permissions', params: { uuid: role.uuid } });
}

async function handleDeleteRole(role: Role) {
    try {
        await deleteRole(role.uuid);
        refreshDatatable();
        notify('success', t('roles.delete.success'));
    } catch (error: unknown) {
        const message = getErrorMessage(error, t('common.unknownError'));
        notify('error', `${t('roles.delete.error')}: ${message}`);
    }
}
</script>
