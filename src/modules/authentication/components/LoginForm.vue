<template>
    <v-form @submit.prevent="login" class="mt-5">
        <AppInput v-model="username" :label="$t('login.username')" autocomplete="username" required class="mb-6" />
        <AppPasswordInput v-model="password" :label="$t('login.password')" autofill required />
        <div class="d-flex align-center my-3 w-100">
            <v-checkbox
                class="mr-0"
                v-model="checkbox"
                :rules="[(v: unknown) => !!v || $t('login.agreeRequired')]"
                required
                hide-details
                color="primary"
            >
                <template v-slot:label>{{ $t('login.remember') }}</template>
            </v-checkbox>
            <div class="ml-auto">
                <AppLink :to="{ name: 'forgot-password' }">{{ $t('login.forgot-password') }}</AppLink>
            </div>
        </div>
        <v-btn
            size="large"
            :loading="loading"
            color="primary"
            :disabled="loading || username === '' || password === ''"
            block
            type="submit"
            flat
            >{{ $t('login.signIn') }}</v-btn
        >
        <div v-if="error" class="mt-2">
            <v-alert color="error">{{ error }}</v-alert>
        </div>
    </v-form>
</template>

<script setup lang="ts">
import { AppInput, AppLink, AppPasswordInput } from 'vuetify-app-kit';
import { ref, toRef } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/modules/authentication/stores/auth';

const { t } = useI18n();
const router = useRouter();
const password = ref('');
const username = ref('');
const error = ref('');
const checkbox = ref(false);

const store = useAuthStore();
const loading = toRef(store, 'loading');

const login = async () => {
    await store
        .login(username.value, password.value)
        .then(() => {
            router.push({ name: 'app-dashboard' });
        })
        .catch((err) => {
            console.log(err);
            error.value = err.message || t('login.signInError');
        });
};
</script>
