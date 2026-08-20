import { ref } from 'vue';
import axios from '@/core/utils/axios';
import { useApiCall } from 'vuetify-app-kit';
import type { User, UserForm, UserTableParams } from '../types/User';

export function useUser() {
    const loading = ref(false);
    const users = ref<User[]>([]);
    const totalItems = ref(0);
    const apiCall = useApiCall(loading);

    async function getUserByUuid(uuid: string) {
        return apiCall(() => axios.get<{ data: User }>(`v1/users/${uuid}`), 'Error fetching user:');
    }

    async function getUsers({ page, itemsPerPage, search, sortBy, filters }: UserTableParams) {
        return apiCall(async () => {
            const response = await axios.get<{ data: User[]; meta: { total: number } }>('v1/users', {
                params: { page, perPage: itemsPerPage, search, sortBy, ...filters }
            });
            users.value = response.data.data;
            totalItems.value = response.data.meta.total;
            return response;
        }, 'Error fetching users:');
    }

    async function createUser(form: UserForm) {
        return apiCall(() => axios.post('v1/users', form), 'Error creating user:');
    }

    async function updateUser(uuid: string, form: UserForm) {
        return apiCall(() => axios.put(`v1/users/${uuid}`, form), 'Error updating user:');
    }

    async function deleteUser(uuid: string) {
        return apiCall(() => axios.delete(`v1/users/${uuid}`), 'Error deleting user:');
    }

    async function restoreUser(uuid: string) {
        return apiCall(() => axios.post(`v1/users/${uuid}/restore`), 'Error restoring user:');
    }

    return { loading, users, totalItems, getUserByUuid, getUsers, createUser, updateUser, deleteUser, restoreUser };
}
