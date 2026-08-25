import { ref } from 'vue';
import axios from '@/core/utils/axios';
import { useApiCall } from 'vuetify-app-kit';
import type { NamedOption, RoleOption } from '@/core/types/common.type';

// Reference lists, served unpaginated from `v1/settings/*`.

export function useRoleOptions() {
    const loading = ref(false);
    const roles = ref<RoleOption[]>([]);
    const apiCall = useApiCall(loading);

    async function loadRoles() {
        await apiCall(async () => {
            const res = await axios.get<{ data: RoleOption[] }>('v1/settings/roles');
            roles.value = res.data.data;
        }, 'Error loading roles:');
    }

    return { roles, loading, loadRoles };
}

export function useGroupOptions() {
    const loading = ref(false);
    const groups = ref<NamedOption[]>([]);
    const apiCall = useApiCall(loading);

    async function loadGroups() {
        await apiCall(async () => {
            const res = await axios.get<{ data: NamedOption[] }>('v1/settings/groups');
            groups.value = res.data.data;
        }, 'Error loading groups:');
    }

    return { groups, loading, loadGroups };
}

// Loads all lists in parallel with a single loading state.

export function useOptions() {
    const loading = ref(false);
    const roles = ref<RoleOption[]>([]);
    const groups = ref<NamedOption[]>([]);
    const apiCall = useApiCall(loading);

    async function loadOptions() {
        await apiCall(async () => {
            const [rolesRes, groupsRes] = await Promise.all([
                axios.get<{ data: RoleOption[] }>('v1/settings/roles'),
                axios.get<{ data: NamedOption[] }>('v1/settings/groups')
            ]);
            roles.value = rolesRes.data.data;
            groups.value = groupsRes.data.data;
        }, 'Error loading options:');
    }

    return { roles, groups, loading, loadOptions };
}
