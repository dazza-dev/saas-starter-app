import { ref } from 'vue';
import axios from '@/core/utils/axios';
import { useApiCall } from 'vuetify-app-kit';
import type { Group, GroupForm, GroupTableParams } from '../types/Group';

export function useGroup() {
    const loading = ref(false);
    const groups = ref<Group[]>([]);
    const totalItems = ref(0);
    const apiCall = useApiCall(loading);

    async function getGroupByUuid(uuid: string) {
        return apiCall(() => axios.get<{ data: Group }>(`v1/groups/${uuid}`), 'Error fetching group:');
    }

    async function getGroups({ page, itemsPerPage, search, sortBy }: GroupTableParams) {
        return apiCall(async () => {
            const response = await axios.get<{ data: Group[]; meta: { total: number } }>('v1/groups', {
                params: { page, perPage: itemsPerPage, search, sortBy }
            });
            groups.value = response.data.data;
            totalItems.value = response.data.meta.total;
            return response;
        }, 'Error fetching groups:');
    }

    async function createGroup(form: GroupForm) {
        return apiCall(() => axios.post('v1/groups', form), 'Error creating group:');
    }

    async function updateGroup(uuid: string, form: GroupForm) {
        return apiCall(() => axios.put(`v1/groups/${uuid}`, form), 'Error updating group:');
    }

    async function deleteGroup(uuid: string) {
        return apiCall(() => axios.delete(`v1/groups/${uuid}`), 'Error deleting group:');
    }

    async function restoreGroup(uuid: string) {
        return apiCall(() => axios.post(`v1/groups/${uuid}/restore`), 'Error restoring group:');
    }

    return { loading, groups, totalItems, getGroupByUuid, getGroups, createGroup, updateGroup, deleteGroup, restoreGroup };
}
