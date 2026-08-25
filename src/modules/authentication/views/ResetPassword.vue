<template>
    <AuthHeroLayout>
        <div class="mb-6">
            <Logo class="auth-form-logo" variant="dark" />
        </div>
        <h2 class="text-h3 font-weight-bold mb-2">{{ $t('login.resetTitle') }}</h2>
        <div class="text-subtitle-1 text-medium-emphasis mb-6">{{ $t('login.resetSubtitle') }}</div>

        <v-alert v-if="!hasLink" color="error">{{ $t('login.resetLinkInvalid') }}</v-alert>
        <ResetPasswordForm v-else />
    </AuthHeroLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import AuthHeroLayout from '@/modules/authentication/layouts/AuthHeroLayout.vue';
import ResetPasswordForm from '@/modules/authentication/components/ResetPasswordForm.vue';
import Logo from '@/core/components/AppLogo.vue';

const route = useRoute();

// No token or email in the URL means nothing to reset: user typed the URL, didn't click the email link.
const hasLink = computed(() => !!route.query.token && !!route.query.email);
</script>

<style scoped>
.auth-form-logo {
    height: 48px;
    width: auto;
    max-width: 180px;
    object-fit: contain;
}
</style>
