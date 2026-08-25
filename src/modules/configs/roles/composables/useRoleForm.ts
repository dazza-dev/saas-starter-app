import { ref } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { useI18n } from 'vue-i18n';
import { useRole } from './useRole';
import { notify } from '@/core/utils/common';
import { getErrorMessage } from 'vuetify-app-kit';
import type { RoleForm } from '../types/Role';

const DEFAULT_FORM: RoleForm = { displayName: '', description: null };

export function useRoleForm() {
    const { t } = useI18n();
    const { getRoleByUuid, createRole, updateRole } = useRole();

    const editedItem = ref<RoleForm>({ ...DEFAULT_FORM });

    // Loads the item when editing; the modal shows a spinner meanwhile.
    const loadingItem = ref(false);

    const v$ = useVuelidate({ displayName: { required } }, editedItem);

    async function loadRole(uuid: string) {
        loadingItem.value = true;

        try {
            const response = await getRoleByUuid(uuid);
            const { displayName, description } = response.data.data;
            editedItem.value = { displayName, description };
        } catch (error: unknown) {
            const message = getErrorMessage(error, t('common.unknownError'));
            notify('error', `${t('roles.load.error')}: ${message}`);
        } finally {
            loadingItem.value = false;
        }
    }

    function resetForm() {
        v$.value.$reset();
        editedItem.value = { ...DEFAULT_FORM };
    }

    async function saveRole(uuid: string): Promise<void> {
        if (v$.value.$invalid) {
            v$.value.$touch();
            notify('error', t('common.formValidationErrors'));
            return Promise.reject();
        }

        const isCreating = uuid === '';
        const successKey = isCreating ? 'roles.create.success' : 'roles.update.success';
        const errorKey = isCreating ? 'roles.create.error' : 'roles.update.error';

        try {
            await (isCreating ? createRole(editedItem.value) : updateRole(uuid, editedItem.value));
            notify('success', t(successKey));
        } catch (error: unknown) {
            const message = getErrorMessage(error, t('common.unknownError'));
            notify('error', `${t(errorKey)}: ${message}`);
            throw error;
        }
    }

    return { editedItem, loadingItem, v$, loadRole, resetForm, saveRole };
}
