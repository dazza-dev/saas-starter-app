import { ref } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { useI18n } from 'vue-i18n';
import { useGroup } from './useGroup';
import { notify } from '@/core/utils/common';
import { getErrorMessage } from 'vuetify-app-kit';
import type { GroupForm } from '../types/Group';

const DEFAULT_FORM: GroupForm = { name: '' };

export function useGroupForm() {
    const { t } = useI18n();
    const { getGroupByUuid, createGroup, updateGroup } = useGroup();

    const editedItem = ref<GroupForm>({ ...DEFAULT_FORM });

    // Loads the item when editing; the modal shows a spinner meanwhile.
    const loadingItem = ref(false);

    const v$ = useVuelidate({ name: { required } }, editedItem);

    async function loadGroup(uuid: string) {
        loadingItem.value = true;

        try {
            const response = await getGroupByUuid(uuid);
            editedItem.value = { name: response.data.data.name };
        } catch (error: unknown) {
            const message = getErrorMessage(error, t('common.unknownError'));
            notify('error', `${t('groups.load.error')}: ${message}`);
        } finally {
            loadingItem.value = false;
        }
    }

    function resetForm() {
        v$.value.$reset();
        editedItem.value = { ...DEFAULT_FORM };
    }

    async function saveGroup(uuid: string): Promise<void> {
        if (v$.value.$invalid) {
            v$.value.$touch();
            notify('error', t('common.formValidationErrors'));
            return Promise.reject();
        }

        const isCreating = uuid === '';
        const successKey = isCreating ? 'groups.create.success' : 'groups.update.success';
        const errorKey = isCreating ? 'groups.create.error' : 'groups.update.error';

        try {
            await (isCreating ? createGroup(editedItem.value) : updateGroup(uuid, editedItem.value));
            notify('success', t(successKey));
        } catch (error: unknown) {
            const message = getErrorMessage(error, t('common.unknownError'));
            notify('error', `${t(errorKey)}: ${message}`);
            throw error;
        }
    }

    return { editedItem, loadingItem, v$, loadGroup, resetForm, saveGroup };
}
