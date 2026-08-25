<template>
    <AppModal
        v-model="dialog"
        :title="$t(formTitle)"
        :save-text="isCreating ? $t('common.save') : $t('common.edit')"
        :save-disabled="v$.$invalid"
        :content-loading="loadingItem"
        @save="handleSaveUser"
        @cancel="close"
    >
        <v-row>
            <v-col cols="12" md="6">
                <AppInput v-model="editedItem.firstName" :label="$t('users.firstName')" required :v$="v$.firstName" />
            </v-col>
            <v-col cols="12" md="6">
                <AppInput v-model="editedItem.lastName" :label="$t('users.lastName')" />
            </v-col>
            <v-col cols="12" md="6">
                <AppInput v-model="editedItem.email" :label="$t('users.email')" required :v$="v$.email" />
            </v-col>
            <v-col cols="12" md="6">
                <AppInput v-model="editedItem.phone" :label="$t('users.phone')" />
            </v-col>
            <v-col cols="12" md="6">
                <AppSelect
                    v-model="editedItem.roleUuids"
                    :label="$t('users.roles')"
                    :items="roles"
                    item-title="name"
                    item-value="uuid"
                    :loading="optionsLoading"
                    multiple
                    chips
                    :v$="v$.roleUuids"
                />
            </v-col>
            <v-col cols="12" md="6">
                <AppSelect v-model="editedItem.status" :label="$t('users.status')" :items="statusOptions" />
            </v-col>
            <v-col cols="12" md="6">
                <AppInput v-model="editedItem.username" :label="$t('users.username')" required :v$="v$.username" />
            </v-col>
            <v-col cols="12" md="6">
                <!-- Left empty on edit to keep the current password unchanged. -->
                <AppPasswordInput
                    v-model="editedItem.password"
                    :label="isCreating ? $t('users.password') : $t('users.passwordOptional')"
                    :v$="v$.password"
                />
            </v-col>
        </v-row>
    </AppModal>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useUserForm } from '../composables/useUserForm';
import { useOptions } from '@/core/composables/useOptions';
import { AppInput, AppModal, AppPasswordInput, AppSelect } from 'vuetify-app-kit';

const props = defineProps<{
    userUuid: string;
    modelValue: boolean;
}>();

const emit = defineEmits<{
    'update:modelValue': [value: boolean];
    saved: [];
}>();

const { t } = useI18n();
const { editedItem, loadingItem, v$, loadUser, resetForm, saveUser } = useUserForm();
const { roles, loading: optionsLoading, loadOptions } = useOptions();

const isCreating = computed(() => props.userUuid === '');
const formTitle = computed(() => (isCreating.value ? 'users.newUser' : 'users.editUser'));

const statusOptions = computed(() => [
    { title: t('users.statusActive'), value: 'active' },
    { title: t('users.statusInactive'), value: 'inactive' }
]);

const dialog = computed({
    get: () => props.modelValue,
    set: (value: boolean) => emit('update:modelValue', value)
});

onMounted(() => loadOptions());

watch([() => props.modelValue, () => props.userUuid], ([isOpen, uuid]) => {
    if (!isOpen) return;
    if (uuid) {
        loadUser(uuid);
    } else {
        resetForm();
    }
});

function close() {
    dialog.value = false;
    setTimeout(() => resetForm(), 300);
}

async function handleSaveUser() {
    try {
        await saveUser(props.userUuid);
        close();
        emit('saved');
    } catch {
        // Errors are already handled in the composable.
    }
}
</script>
