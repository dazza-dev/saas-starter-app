import { ref } from 'vue';
import axios from '@/core/utils/axios';
import { useApiCall } from 'vuetify-app-kit';
import { useAuthStore } from '@/modules/authentication/stores/auth';
import type { AuthUser, ProfileForm, ProfileUpdatePayload } from '@/modules/authentication/types/AuthUser';

const DEFAULT_FORM: ProfileForm = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    passwordConfirmation: ''
};

export function useProfile() {
    const authStore = useAuthStore();
    const loading = ref(false);
    const saving = ref(false);
    const apiCall = useApiCall(loading);
    const saveCall = useApiCall(saving);

    const form = ref<ProfileForm>({ ...DEFAULT_FORM });

    function loadFromStore() {
        const user = authStore.user;
        if (!user) return;
        form.value = {
            firstName: user.firstName ?? '',
            lastName: user.lastName ?? '',
            email: user.email ?? '',
            phone: user.phone ?? '',
            username: user.username ?? '',
            password: '',
            passwordConfirmation: ''
        };
    }

    async function loadProfile() {
        return apiCall(async () => {
            const res = await axios.post<{ data: AuthUser }>('v1/auth/profile');
            authStore.user = res.data.data;
            loadFromStore();
            return res;
        }, 'Error fetching profile:');
    }

    async function saveProfile() {
        return saveCall(async () => {
            const payload: ProfileUpdatePayload = {
                firstName: form.value.firstName || null,
                lastName: form.value.lastName || null,
                email: form.value.email || null,
                phone: form.value.phone || null,
                username: form.value.username || null
            };
            if (form.value.password) {
                payload.password = form.value.password;
                payload.passwordConfirmation = form.value.passwordConfirmation;
            }
            const res = await axios.put<{ data: AuthUser }>('v1/auth/profile', payload);
            authStore.user = res.data.data;
            loadFromStore();
            return res;
        }, 'Error saving profile:');
    }

    function resetForm() {
        loadFromStore();
    }

    return { loading, saving, form, loadProfile, saveProfile, resetForm };
}
