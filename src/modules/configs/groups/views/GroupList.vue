<template>
    <PageHeader :title="pageTitle.title" :subtitle="pageTitle.subtitle">
        <template v-slot:actions>
            <v-btn color="primary" flat @click="openCreateModal">
                <v-icon class="mr-2">mdi-plus</v-icon> {{ $t('groups.newGroup') }}
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
                            :label="$t('groups.searchGroups')"
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
                    @editItem="editGroup"
                    @deleteItem="handleDeleteGroup"
                    :deleteButtonText="$t('common.delete')"
                    :deleteModalTitle="$t('groups.delete.modalTitle')"
                    :deleteModalConfirmButtonText="$t('common.confirmDelete')"
                    :deleteModalCancelButtonText="$t('common.cancel')"
                    :editButtonText="$t('common.edit')"
                />
            </ParentCard>
        </v-col>
    </v-row>

    <GroupForm v-model="dialogEdit" :groupUuid="groupUuid" @saved="refreshDatatable()" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useGroup } from '../composables/useGroup';
import { useGroupPageConfig } from '../composables/useGroupPageConfig';
import { notify } from '@/core/utils/common';
import { AppInput, DEFAULT_ITEMS_PER_PAGE, getErrorMessage } from 'vuetify-app-kit';
import type { Group } from '../types/Group';
import type { LoadDataParams } from '@dazzadev/vuetify-datatable';
import GroupForm from './GroupForm.vue';

const { t } = useI18n();
const { groups: items, loading, totalItems, getGroups, deleteGroup } = useGroup();
const { pageTitle, headers } = useGroupPageConfig();

const dialogEdit = ref(false);
const groupUuid = ref('');
const search = ref('');

function refreshDatatable() {
    loadData({ page: 1, itemsPerPage: DEFAULT_ITEMS_PER_PAGE });
}

function loadData(params: LoadDataParams) {
    getGroups({ page: params.page, itemsPerPage: params.itemsPerPage, search: search.value, sortBy: params.sortBy });
}

function openCreateModal() {
    groupUuid.value = '';
    dialogEdit.value = true;
}

function editGroup(group: Group) {
    groupUuid.value = group.uuid;
    dialogEdit.value = true;
}

async function handleDeleteGroup(group: Group) {
    try {
        await deleteGroup(group.uuid);
        refreshDatatable();
        notify('success', t('groups.delete.success'));
    } catch (error: unknown) {
        const message = getErrorMessage(error, t('common.unknownError'));
        notify('error', `${t('groups.delete.error')}: ${message}`);
    }
}
</script>
