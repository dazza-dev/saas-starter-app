<template>
    <v-form class="mt-5" @submit.prevent="submit">
        <AppInput v-model="email" :label="$t('login.email')" type="email" autocomplete="email" required />

        <v-btn size="large" color="primary" block flat type="submit" class="mt-6" :loading="loading" :disabled="loading || !email.trim()">
            {{ $t('login.sendResetLink') }}
        </v-btn>

        <div class="text-center mt-4">
            <AppLink :to="{ name: 'login' }">{{ $t('login.backToLogin') }}</AppLink>
        </div>

        <v-alert v-if="sent" color="success" class="mt-4">{{ sent }}</v-alert>
        <v-alert v-if="error" color="error" class="mt-4">{{ error }}</v-alert>
    </v-form>
</template>

<script setup lang="ts">
import { ref, toRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { AppInput, AppLink, getErrorMessage } from 'vuetify-app-kit';
import { useAuthStore } from '@/modules/authentication/stores/auth';

const { t } = useI18n();
const store = useAuthStore();
const loading = toRef(store, 'loading');

const email = ref('');
const sent = ref('');
const error = ref('');

async function submit() {
    sent.value = '';
    error.value = '';

    try {
        const response = await store.forgotPassword(email.value.trim());
        sent.value = response?.data.message ?? t('login.resetLinkSent');
    } catch (err: unknown) {
        error.value = getErrorMessage(err, t('login.resetLinkError'));
    }
}
</script>
