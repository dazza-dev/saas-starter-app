<template>
    <v-form class="mt-5" @submit.prevent="submit">
        <AppInput v-model="account" :label="$t('login.account')" autocomplete="organization" required />

        <v-btn size="large" color="primary" block flat type="submit" class="mt-6" :loading="loading" :disabled="loading || !account.trim()">
            {{ $t('login.continue') }}
        </v-btn>

        <v-alert v-if="error" color="error" class="mt-4">{{ error }}</v-alert>
    </v-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import axios from 'axios';
import { AppInput } from 'vuetify-app-kit';
import { getBaseUrl } from '@/core/utils/common';

const { t } = useI18n();

const account = ref('');
const error = ref('');
const loading = ref(false);

// The tenant travels as a URL segment and a header, so only slug characters are allowed.
const TENANT_SLUG = /^[a-z0-9][a-z0-9-]*$/;

async function submit() {
    const tenant = account.value.trim().toLowerCase();
    error.value = '';

    if (!TENANT_SLUG.test(tenant)) {
        error.value = t('login.accountInvalid');
        return;
    }

    loading.value = true;

    try {
        // The public settings endpoint returns 404 when the tenant doesn't exist.
        await axios.get(`${getBaseUrl()}/api/v1/settings`, { headers: { 'X-Tenant': tenant } });

        // Full reload instead of router.push: the tenant is resolved from the URL on startup.
        window.location.href = `/${tenant}/auth/login`;
    } catch {
        error.value = t('login.accountNotFound');
    } finally {
        loading.value = false;
    }
}
</script>
