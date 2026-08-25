<template>
    <AppModal
        v-model="dialog"
        :title="$t(formTitle)"
        :save-text="isCreating ? $t('common.save') : $t('common.edit')"
        :save-disabled="v$.$invalid"
        :content-loading="loadingItem"
        @save="handleSaveGroup"
        @cancel="close"
    >
        <v-row>
            <v-col cols="12">
                <AppInput v-model="editedItem.name" :label="$t('groups.name')" required :v$="v$.name" />
            </v-col>
        </v-row>
    </AppModal>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useGroupForm } from '../composables/useGroupForm';
import { AppInput, AppModal } from 'vuetify-app-kit';

const props = defineProps<{
    groupUuid: string;
    modelValue: boolean;
}>();

const emit = defineEmits<{
    'update:modelValue': [value: boolean];
    saved: [];
}>();

const { editedItem, loadingItem, v$, loadGroup, resetForm, saveGroup } = useGroupForm();

const isCreating = computed(() => props.groupUuid === '');
const formTitle = computed(() => (isCreating.value ? 'groups.newGroup' : 'groups.editGroup'));

const dialog = computed({
    get: () => props.modelValue,
    set: (value: boolean) => emit('update:modelValue', value)
});

watch([() => props.modelValue, () => props.groupUuid], ([isOpen, uuid]) => {
    if (!isOpen) return;
    if (uuid) {
        loadGroup(uuid);
    } else {
        resetForm();
    }
});

function close() {
    dialog.value = false;
    setTimeout(() => resetForm(), 300);
}

async function handleSaveGroup() {
    try {
        await saveGroup(props.groupUuid);
        close();
        emit('saved');
    } catch {
        // Errors are already handled in the composable.
    }
}
</script>
