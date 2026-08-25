import { ref } from 'vue';
import { defineStore } from 'pinia';
import axios from '@/core/utils/axios';
import { useApiCall } from 'vuetify-app-kit';
import ability from '@/core/plugins/ability';
import type { AuthUser, MyPermissions, ResetPasswordPayload } from '@/modules/authentication/types/AuthUser';

export const useAuthStore = defineStore('auth', () => {
    const loading = ref(false);
    const user = ref<AuthUser | null>(null);
    const permissions = ref<string[]>([]);
    const isAdmin = ref(false);
    // Dedicated flag: an empty list can't distinguish "no permissions" from "not loaded yet".
    const permissionsLoaded = ref(false);
    const apiCall = useApiCall(loading);

    async function profile() {
        return apiCall(async () => {
            const response = await axios.post<{ data: AuthUser }>('v1/auth/profile');
            user.value = response.data.data;
            return response;
        }, 'Error fetching profile:');
    }

    async function login(username: string, password: string) {
        return apiCall(async () => {
            const response = await axios.post<{ data: AuthUser }>('v1/auth/login', { username, password });
            user.value = response.data.data;
            return response;
        }, 'Error logging in:');
    }

    async function logout() {
        try {
            // Local session is cleared no matter what the server does.
            return await apiCall(() => axios.post('v1/auth/logout'), 'Error logging out:');
        } finally {
            user.value = null;
            resetPermissions();
        }
    }

    async function forgotPassword(email: string) {
        return apiCall(() => axios.post<{ message: string }>('v1/auth/forgot-password', { email }), 'Error requesting password reset:');
    }

    async function resetPassword(payload: ResetPasswordPayload) {
        return apiCall(() => axios.post<{ message: string }>('v1/auth/reset-password', payload), 'Error resetting password:');
    }

    async function autoLogin(token: string) {
        return apiCall(async () => {
            const response = await axios.post<{ data: AuthUser }>('v1/auth/auto-login', { token });
            user.value = response.data.data;
            return response;
        }, 'Auto-login failed:');
    }

    /**
     * Loads permissions and syncs CASL, giving admins `manage all` instead of the enumerated list.
     */
    async function getPermissions(): Promise<void> {
        await apiCall(async () => {
            const response = await axios.get<{ data: MyPermissions }>('v1/permissions/me');
            const data = response.data.data;

            permissions.value = data.permissions;
            isAdmin.value = data.isAdmin;
            permissionsLoaded.value = true;

            ability.update(data.isAdmin ? [{ action: 'manage', subject: 'all' }] : [{ action: data.permissions, subject: 'all' }]);

            return response;
        }, 'Error fetching permissions:');
    }

    /**
     * Whether the user has a permission, the same `can` used by the guard and the v-can directive.
     */
    function can(permission: string): boolean {
        return ability.can(permission, 'all');
    }

    /**
     * Clears permissions and leaves CASL denying everything.
     */
    function resetPermissions(): void {
        permissions.value = [];
        isAdmin.value = false;
        permissionsLoaded.value = false;
        ability.update([]);
    }

    return {
        loading,
        user,
        permissions,
        isAdmin,
        permissionsLoaded,
        profile,
        login,
        logout,
        autoLogin,
        forgotPassword,
        resetPassword,
        getPermissions,
        can,
        resetPermissions
    };
});
