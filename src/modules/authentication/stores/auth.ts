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
    // Bandera propia: la lista vacía no distingue "sin permisos" de "aún no cargados".
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
            // La sesion local se limpia pase lo que pase en el servidor.
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
     * Carga los permisos y sincroniza CASL. Al admin se le da `manage all`, no la lista.
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
     * Indica si el usuario tiene un permiso. Es el mismo `can` que usan el guard y la directiva v-can.
     */
    function can(permission: string): boolean {
        return ability.can(permission, 'all');
    }

    /**
     * Limpia los permisos y deja a CASL denegando todo.
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
