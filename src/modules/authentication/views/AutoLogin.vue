<template>
    <div class="auto-login-screen d-flex flex-column align-center justify-center">
        <!-- The stroke uses the tenant's brand color. -->
        <svg
            class="auto-login-spinner"
            :style="{ color: brandColor }"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
        >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
        <p class="auto-login-title mt-6">{{ $t('login.signingIn') }}</p>
        <p class="auto-login-hint mt-2">{{ $t('login.signingInHint') }}</p>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/modules/authentication/stores/auth';
import { useConfigStore } from '@/core/stores/config';

const route = useRoute();
const router = useRouter();
const store = useAuthStore();
const configStore = useConfigStore();

// Fallback brand color, used while the tenant's settings are still loading.
const brandColor = computed(() => (configStore.settings['COLOR'] as string) || '#7FB384');

const rawToken = route.query.auto_login_token;
const token = typeof rawToken === 'string' && rawToken !== '' ? rawToken : null;

// Runs in Promise.all alongside the real request: adds no latency if the API takes longer.
const MIN_VISIBLE_MS = 1500;
const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

onMounted(async () => {
    if (!token) {
        router.replace({ name: 'login' });
        return;
    }

    try {
        await Promise.all([store.autoLogin(token), wait(MIN_VISIBLE_MS)]);
        router.replace({ name: 'app-dashboard' });
    } catch (err) {
        console.warn('Auto-login failed; redirecting to manual login.', err);
        router.replace({ name: 'login' });
    }
});
</script>

<style scoped>
.auto-login-screen {
    min-height: 100vh;
    width: 100%;
    background-color: #ffffff;
}

.auto-login-spinner {
    width: 3.5rem;
    height: 3.5rem;
    animation: auto-login-spin 1s linear infinite;
}

.auto-login-title {
    font-size: 1rem;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.87);
    text-align: center;
}

.auto-login-hint {
    font-size: 0.875rem;
    color: rgba(0, 0, 0, 0.6);
    text-align: center;
}

@keyframes auto-login-spin {
    to {
        transform: rotate(360deg);
    }
}

@media (prefers-reduced-motion: reduce) {
    .auto-login-spinner {
        animation-duration: 3s;
    }
}
</style>
