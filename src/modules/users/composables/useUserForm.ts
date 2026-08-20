import { computed, ref } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { email, helpers, minLength, required, requiredIf } from '@vuelidate/validators';
import { useI18n } from 'vue-i18n';
import { useUser } from './useUser';
import { notify } from '@/core/utils/common';
import { getErrorMessage } from 'vuetify-app-kit';
import type { UserForm } from '../types/User';

const DEFAULT_FORM: UserForm = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    status: 'active',
    roleUuids: []
};

export function useUserForm() {
    const { t } = useI18n();
    const { getUserByUuid, createUser, updateUser } = useUser();

    const editedItem = ref<UserForm>({ ...DEFAULT_FORM });

    // Carga del elemento al editar; el modal muestra un spinner mientras tanto.
    const loadingItem = ref(false);
    // La contraseña solo es obligatoria al crear: en edición, vacía significa "no cambiarla".
    const isCreating = ref(true);

    const rules = computed(() => ({
        firstName: { required },
        email: { required, email },
        username: { required },
        roleUuids: { required },
        password: {
            requiredIfCreating: helpers.withMessage(() => t('users.validation.passwordRequired'), requiredIf(isCreating)),
            minLength: minLength(8)
        }
    }));

    const v$ = useVuelidate(rules, editedItem);

    async function loadUser(uuid: string) {
        isCreating.value = false;
        loadingItem.value = true;

        try {
            const response = await getUserByUuid(uuid);
            const user = response.data.data;

            editedItem.value = {
                firstName: user.firstName,
                lastName: user.lastName ?? '',
                email: user.email,
                phone: user.phone ?? '',
                username: user.username,
                password: '',
                status: user.status,
                roleUuids: user.roles.map((role) => role.uuid)
            };
        } catch (error: unknown) {
            const message = getErrorMessage(error, t('common.unknownError'));
            notify('error', `${t('users.load.error')}: ${message}`);
        } finally {
            loadingItem.value = false;
        }
    }

    function resetForm() {
        isCreating.value = true;
        v$.value.$reset();
        editedItem.value = { ...DEFAULT_FORM };
    }

    async function saveUser(uuid: string): Promise<void> {
        if (v$.value.$invalid) {
            v$.value.$touch();
            notify('error', t('common.formValidationErrors'));
            return Promise.reject();
        }

        const creating = uuid === '';
        const successKey = creating ? 'users.create.success' : 'users.update.success';
        const errorKey = creating ? 'users.create.error' : 'users.update.error';

        try {
            await (creating ? createUser(editedItem.value) : updateUser(uuid, editedItem.value));
            notify('success', t(successKey));
        } catch (error: unknown) {
            const message = getErrorMessage(error, t('common.unknownError'));
            notify('error', `${t(errorKey)}: ${message}`);
            throw error;
        }
    }

    return { editedItem, loadingItem, v$, loadUser, resetForm, saveUser };
}
