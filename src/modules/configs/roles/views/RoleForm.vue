<template>
    <AppModal
        v-model="dialog"
        :title="$t(formTitle)"
        :save-text="isCreating ? $t('common.save') : $t('common.edit')"
        :save-disabled="v$.$invalid"
        :content-loading="loadingItem"
        @save="handleSave"
        @cancel="close"
    >
        <v-row>
            <v-col cols="12">
                <AppInput v-model="editedItem.displayName" :label="$t('roles.displayName')" required :v$="v$.displayName" />
            </v-col>
            <v-col cols="12">
                <AppInput v-model="editedItem.description" :label="$t('roles.description')" />
            </v-col>
        </v-row>
    </AppModal>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useRoleForm } from '../composables/useRoleForm';
import { AppInput, AppModal } from 'vuetify-app-kit';

const props = defineProps<{
    roleUuid: string;
    modelValue: boolean;
}>();

const emit = defineEmits<{
    'update:modelValue': [value: boolean];
    saved: [];
}>();

const { editedItem, loadingItem, v$, loadRole, resetForm, saveRole } = useRoleForm();

const isCreating = computed(() => props.roleUuid === '');
const formTitle = computed(() => (isCreating.value ? 'roles.newRole' : 'roles.editRole'));

const dialog = computed({
    get: () => props.modelValue,
    set: (value: boolean) => emit('update:modelValue', value)
});

watch([() => props.modelValue, () => props.roleUuid], ([isOpen, uuid]) => {
    if (!isOpen) return;
    if (uuid) {
        loadRole(uuid);
    } else {
        resetForm();
    }
});

function close() {
    dialog.value = false;
    setTimeout(() => resetForm(), 300);
}

async function handleSave() {
    try {
        await saveRole(props.roleUuid);
        close();
        emit('saved');
    } catch {
        // Errors are already handled by the composable.
    }
}
</script>
