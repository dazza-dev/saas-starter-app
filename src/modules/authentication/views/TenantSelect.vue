<template>
    <AuthHeroLayout>
        <div class="mb-6">
            <Logo class="auth-form-logo" variant="dark" />
        </div>
        <h2 class="text-h3 font-weight-bold mb-2">{{ $t('login.accountTitle') }}</h2>
        <div class="text-subtitle-1 text-medium-emphasis mb-6">{{ $t('login.accountText') }}</div>
        <TenantForm />
    </AuthHeroLayout>
</template>

<script setup lang="ts">
import AuthHeroLayout from '@/modules/authentication/layouts/AuthHeroLayout.vue';
import TenantForm from '@/modules/authentication/components/TenantForm.vue';
import Logo from '@/core/components/AppLogo.vue';
</script>

<style scoped>
.auth-form-logo {
    height: 48px;
    width: auto;
    max-width: 180px;
    object-fit: contain;
}
</style>
