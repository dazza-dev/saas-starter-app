<template>
    <PageHeader :title="$t('roles.permissionsTitle')" :subtitle="role?.displayName">
        <template v-slot:actions>
            <v-btn variant="text" class="mr-2" @click="router.push({ name: 'configs-roles' })">
                {{ $t('common.cancel') }}
            </v-btn>
            <v-btn color="primary" flat :loading="saving" :disabled="!dirty" @click="handleSave">
                <v-icon class="mr-2">mdi-content-save</v-icon>
                {{ $t('common.save') }}
            </v-btn>
        </template>
    </PageHeader>

    <ParentCard>
        <div v-if="loading" class="d-flex justify-center pa-10">
            <v-progress-circular indeterminate color="primary" />
        </div>

        <template v-else>
            <v-tabs v-model="tab" color="primary" class="mb-4">
                <v-tab v-for="module in modules" :key="module.module ?? 'general'" :value="module.module ?? 'general'">
                    {{ module.label }}
                    <v-chip size="x-small" class="ml-2" variant="tonal">
                        {{ moduleCount(module).selected }}/{{ moduleCount(module).total }}
                    </v-chip>
                </v-tab>
            </v-tabs>

            <v-tabs-window v-model="tab">
                <v-tabs-window-item v-for="module in modules" :key="module.module ?? 'general'" :value="module.module ?? 'general'">
                    <div v-for="group in module.groups" :key="group.group" class="permission-group py-4">
                        <v-row align="start">
                            <v-col cols="12" md="3">
                                <div class="d-flex align-center ga-2">
                                    <v-checkbox
                                        :model-value="groupState(group).all"
                                        :indeterminate="groupState(group).some"
                                        color="primary"
                                        density="compact"
                                        hide-details
                                        @update:model-value="toggleGroup(group, $event)"
                                    />
                                    <span class="text-subtitle-2 font-weight-bold">{{ group.label }}</span>
                                </div>
                            </v-col>

                            <v-col cols="12" md="9">
                                <v-row dense>
                                    <v-col v-for="permission in group.permissions" :key="permission.uuid" cols="12" sm="6" md="4">
                                        <v-checkbox
                                            v-model="selected"
                                            :value="permission.uuid"
                                            :label="permission.label"
                                            color="primary"
                                            density="compact"
                                            hide-details
                                        />
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                        <v-divider class="mt-4" />
                    </div>
                </v-tabs-window-item>
            </v-tabs-window>
        </template>
    </ParentCard>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { getErrorMessage } from 'vuetify-app-kit';
import { notify } from '@/core/utils/common';
import { useRole } from '../composables/useRole';
import type { PermissionGroup, PermissionModule, Role } from '../types/Role';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const { loading, getRoleByUuid, getRolePermissions, saveRolePermissions } = useRole();

const uuid = route.params.uuid as string;

const role = ref<Role | null>(null);
const modules = ref<PermissionModule[]>([]);
const selected = ref<string[]>([]);
const initial = ref<string[]>([]);
const tab = ref('');
const saving = ref(false);

// Se compara contra el estado inicial para no permitir guardar si no se cambió nada.
const dirty = computed(() => {
    if (selected.value.length !== initial.value.length) return true;
    const set = new Set(initial.value);
    return selected.value.some((uuid) => !set.has(uuid));
});

/**
 * Contador de la pestaña: cuántos permisos del módulo están marcados.
 */
function moduleCount(module: PermissionModule): { selected: number; total: number } {
    const permissions = module.groups.flatMap((group) => group.permissions);

    return {
        total: permissions.length,
        selected: permissions.filter((permission) => selected.value.includes(permission.uuid)).length
    };
}

/**
 * Estado del checkbox del grupo: marcado si están todos, indeterminado si hay algunos.
 */
function groupState(group: PermissionGroup): { all: boolean; some: boolean } {
    const count = group.permissions.filter((p) => selected.value.includes(p.uuid)).length;

    return {
        all: count === group.permissions.length && count > 0,
        some: count > 0 && count < group.permissions.length
    };
}

/**
 * Marca o desmarca todos los permisos del grupo de una vez.
 */
function toggleGroup(group: PermissionGroup, checked: boolean | null): void {
    const uuids = group.permissions.map((p) => p.uuid);

    selected.value = checked ? [...new Set([...selected.value, ...uuids])] : selected.value.filter((uuid) => !uuids.includes(uuid));
}

async function handleSave() {
    saving.value = true;
    try {
        await saveRolePermissions(uuid, selected.value);
        initial.value = [...selected.value];
        notify('success', t('roles.permissionsSaved'));
    } catch (error: unknown) {
        notify('error', getErrorMessage(error, t('common.unknownError')));
    } finally {
        saving.value = false;
    }
}

onMounted(async () => {
    try {
        const [roleResponse, permissionsResponse] = await Promise.all([getRoleByUuid(uuid), getRolePermissions(uuid)]);

        role.value = roleResponse.data.data;
        modules.value = permissionsResponse.data.data;
        selected.value = [...permissionsResponse.data.assigned];
        initial.value = [...permissionsResponse.data.assigned];
        tab.value = modules.value[0]?.module ?? 'general';
    } catch (error: unknown) {
        notify('error', getErrorMessage(error, t('common.unknownError')));
    }
});
</script>

<style scoped>
.permission-group:last-child :deep(hr) {
    display: none;
}
</style>
