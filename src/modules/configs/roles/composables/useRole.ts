import { ref } from 'vue';
import axios from '@/core/utils/axios';
import { useApiCall } from 'vuetify-app-kit';
import type { Role, RoleForm, RolePermissionsResponse, RoleTableParams } from '../types/Role';

export function useRole() {
    const loading = ref(false);
    const roles = ref<Role[]>([]);
    const totalItems = ref(0);
    const apiCall = useApiCall(loading);

    async function getRoleByUuid(uuid: string) {
        return apiCall(() => axios.get<{ data: Role }>(`v1/roles/${uuid}`), 'Error fetching role:');
    }

    async function getRoles({ page, itemsPerPage, search, sortBy }: RoleTableParams) {
        return apiCall(async () => {
            const response = await axios.get<{ data: Role[]; meta: { total: number } }>('v1/roles', {
                params: { page, perPage: itemsPerPage, search, sortBy }
            });
            roles.value = response.data.data;
            totalItems.value = response.data.meta.total;
            return response;
        }, 'Error fetching roles:');
    }

    async function createRole(form: RoleForm) {
        return apiCall(() => axios.post('v1/roles', form), 'Error creating role:');
    }

    async function updateRole(uuid: string, form: RoleForm) {
        return apiCall(() => axios.put(`v1/roles/${uuid}`, form), 'Error updating role:');
    }

    async function deleteRole(uuid: string) {
        return apiCall(() => axios.delete(`v1/roles/${uuid}`), 'Error deleting role:');
    }

    async function restoreRole(uuid: string) {
        return apiCall(() => axios.post(`v1/roles/${uuid}/restore`), 'Error restoring role:');
    }

    /**
     * Returns the permission catalog and the ones assigned to the role.
     */
    async function getRolePermissions(uuid: string) {
        return apiCall(() => axios.get<RolePermissionsResponse>(`v1/roles/${uuid}/permissions`), 'Error fetching role permissions:');
    }

    /**
     * Saves all the role's permissions in a single request.
     */
    async function saveRolePermissions(uuid: string, permissions: string[]) {
        return apiCall(() => axios.put(`v1/roles/${uuid}/permissions`, { permissions }), 'Error saving role permissions:');
    }

    return {
        loading,
        roles,
        totalItems,
        getRoleByUuid,
        getRoles,
        createRole,
        updateRole,
        deleteRole,
        restoreRole,
        getRolePermissions,
        saveRolePermissions
    };
}
