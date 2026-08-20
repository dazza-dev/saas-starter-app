<template>
    <PageHeader :title="pageTitle.title" :subtitle="pageTitle.subtitle">
        <template v-slot:actions>
            <v-btn v-can="'create-users'" color="primary" flat @click="openCreateModal">
                <v-icon class="mr-2">mdi-plus</v-icon> {{ $t('users.newUser') }}
            </v-btn>
        </template>
    </PageHeader>
    <v-row>
        <v-col cols="12">
            <ParentCard>
                <template #header>
                    <div class="card-header-search">
                        <AppInput
                            v-model="search"
                            :label="$t('users.searchUsers')"
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
                    @editItem="editUser"
                    @deleteItem="handleDeleteUser"
                    :deleteButtonText="$t('common.delete')"
                    :deleteModalTitle="$t('users.delete.modalTitle')"
                    :deleteModalConfirmButtonText="$t('common.confirmDelete')"
                    :deleteModalCancelButtonText="$t('common.cancel')"
                    :editButtonText="$t('common.edit')"
                >
                    <template #item.firstName="{ item }">
                        {{ item.fullName }}
                    </template>
                    <template #item.roles="{ item }">
                        {{ roleNames(item) }}
                    </template>
                    <template #item.status="{ item }">
                        <Tag
                            :color="item.status === 'active' ? 'lightsuccess' : 'lighterror'"
                            :title="item.status === 'active' ? $t('users.statusActive') : $t('users.statusInactive')"
                        />
                    </template>
                </DataTable>
            </ParentCard>
        </v-col>
    </v-row>

    <UserForm v-model="dialogEdit" :userUuid="userUuid" @saved="refreshDatatable()" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useUser } from '../composables/useUser';
import { useUserPageConfig } from '../composables/useUserPageConfig';
import { notify } from '@/core/utils/common';
import { AppInput, DEFAULT_ITEMS_PER_PAGE, getErrorMessage } from 'vuetify-app-kit';
import type { User } from '../types/User';
import type { LoadDataParams } from '@dazzadev/vuetify-datatable';
import UserForm from './UserForm.vue';

const { t } = useI18n();
const { users: items, loading, totalItems, getUsers, deleteUser } = useUser();
const { pageTitle, headers } = useUserPageConfig();

const dialogEdit = ref(false);
const userUuid = ref('');
const search = ref('');

function refreshDatatable() {
    loadData({ page: 1, itemsPerPage: DEFAULT_ITEMS_PER_PAGE });
}

function loadData(params: LoadDataParams) {
    getUsers({ page: params.page, itemsPerPage: params.itemsPerPage, search: search.value, sortBy: params.sortBy });
}

function openCreateModal() {
    userUuid.value = '';
    dialogEdit.value = true;
}

function roleNames(user: User): string {
    return user.roles.map((role) => role.name).join(', ') || '—';
}

function editUser(user: User) {
    userUuid.value = user.uuid;
    dialogEdit.value = true;
}

async function handleDeleteUser(user: User) {
    try {
        await deleteUser(user.uuid);
        refreshDatatable();
        notify('success', t('users.delete.success'));
    } catch (error: unknown) {
        const message = getErrorMessage(error, t('common.unknownError'));
        notify('error', `${t('users.delete.error')}: ${message}`);
    }
}
</script>
