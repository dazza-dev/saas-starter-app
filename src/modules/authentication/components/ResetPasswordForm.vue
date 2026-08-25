<template>
    <v-form class="mt-5" @submit.prevent="submit">
        <AppPasswordInput v-model="password" :label="$t('login.newPassword')" required class="mb-6" />
        <AppPasswordInput v-model="passwordConfirmation" :label="$t('login.confirmPassword')" required />

        <v-btn size="large" color="primary" block flat type="submit" class="mt-6" :loading="loading" :disabled="loading || !canSubmit">
            {{ $t('login.changePassword') }}
        </v-btn>

        <div class="text-center mt-4">
            <AppLink :to="{ name: 'login' }">{{ $t('login.backToLogin') }}</AppLink>
        </div>

        <v-alert v-if="error" color="error" class="mt-4">{{ error }}</v-alert>
    </v-form>
</template>

<script setup lang="ts">
import { computed, ref, toRef } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { AppLink, AppPasswordInput, getErrorMessage } from 'vuetify-app-kit';
import { notify } from '@/core/utils/common';
import { useAuthStore } from '@/modules/authentication/stores/auth';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const store = useAuthStore();
const loading = toRef(store, 'loading');

const password = ref('');
const passwordConfirmation = ref('');
const error = ref('');

const token = String(route.query.token ?? '');
const email = String(route.query.email ?? '');

const canSubmit = computed(() => password.value.length > 0 && password.value === passwordConfirmation.value);

async function submit() {
    error.value = '';

    try {
        const response = await store.resetPassword({
            token,
            email,
            password: password.value,
            passwordConfirmation: passwordConfirmation.value
        });

        notify('success', response?.data.message ?? t('login.resetSuccess'));
        router.push({ name: 'login' });
    } catch (err: unknown) {
        error.value = getErrorMessage(err, t('login.resetError'));
    }
}
</script>
