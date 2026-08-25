<template>
    <PageHeader :title="t('profile.title')" :subtitle="t('profile.subtitle')">
        <template #actions>
            <v-btn variant="outlined" :disabled="saving" @click="resetForm">{{ t('profile.cancel') }}</v-btn>
            <v-btn color="primary" :loading="saving" @click="handleSave">{{ t('profile.save') }}</v-btn>
        </template>
    </PageHeader>

    <ParentCard>
        <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-4" />

        <!-- Personal data -->
        <v-row class="profile-section">
            <v-col cols="12" sm="4">
                <h6 class="text-h6 font-weight-semibold">{{ t('profile.personalData') }}</h6>
                <p class="text-body-2 text-medium-emphasis mt-1">{{ t('profile.personalDataDesc') }}</p>
            </v-col>
            <v-col cols="12" sm="8">
                <v-row>
                    <v-col cols="12" sm="6">
                        <AppInput v-model="form.firstName" :label="t('profile.firstName')" density="compact" />
                    </v-col>
                    <v-col cols="12" sm="6">
                        <AppInput v-model="form.lastName" :label="t('profile.lastName')" density="compact" />
                    </v-col>
                    <v-col cols="12">
                        <AppInput v-model="form.email" :label="t('profile.email')" type="email" density="compact" />
                    </v-col>
                    <v-col cols="12">
                        <AppInput v-model="form.phone" :label="t('profile.phone')" density="compact" />
                    </v-col>
                </v-row>
            </v-col>
        </v-row>

        <v-divider class="my-6" />

        <!-- Credentials -->
        <v-row class="profile-section">
            <v-col cols="12" sm="4">
                <h6 class="text-h6 font-weight-semibold">{{ t('profile.credentials') }}</h6>
                <p class="text-body-2 text-medium-emphasis mt-1">{{ t('profile.credentialsDesc') }}</p>
            </v-col>
            <v-col cols="12" sm="8">
                <v-row>
                    <v-col cols="12">
                        <AppInput v-model="form.username" :label="t('profile.username')" density="compact" />
                    </v-col>
                    <v-col cols="12">
                        <AppPasswordInput
                            v-model="form.password"
                            :label="t('profile.password')"
                            density="compact"
                            :placeholder="t('profile.password')"
                        />
                    </v-col>
                    <v-col v-if="form.password" cols="12">
                        <AppPasswordInput v-model="form.passwordConfirmation" :label="t('profile.confirmPassword')" density="compact" />
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </ParentCard>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useProfile } from '../composables/useProfile';
import { AppInput, AppPasswordInput } from 'vuetify-app-kit';
import { notify } from '@/core/utils/common';

const { t } = useI18n();
const { loading, saving, form, loadProfile, saveProfile, resetForm } = useProfile();

async function handleSave() {
    try {
        await saveProfile();
        notify('success', t('profile.saveSuccess'));
    } catch {
        notify('error', t('profile.saveError'));
    }
}

onMounted(loadProfile);
</script>

<style scoped>
.profile-section {
    align-items: flex-start;
}
</style>
