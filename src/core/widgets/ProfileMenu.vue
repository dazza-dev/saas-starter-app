<template>
    <v-menu :close-on-content-click="false">
        <template v-slot:activator="{ props }">
            <v-btn class="custom-hover-primary" variant="text" v-bind="props" icon>
                <v-avatar size="35" color="primary">
                    <span class="text-subtitle-1 font-weight-bold">{{ initials }}</span>
                </v-avatar>
            </v-btn>
        </template>
        <v-sheet rounded="md" width="360" elevation="10">
            <div class="px-8 pt-6">
                <div class="d-flex align-center pb-6">
                    <v-avatar size="80" color="primary">
                        <span class="text-h4 font-weight-bold">{{ initials }}</span>
                    </v-avatar>
                    <div class="ml-3">
                        <h6 class="text-h6 mb-n1">{{ user?.name }}</h6>
                        <span v-if="showUsername" class="text-subtitle-1 font-weight-regular textSecondary">{{ user?.username }}</span>
                        <div class="d-flex align-center mt-1">
                            <MailIcon size="18" stroke-width="1.5" />
                            <span class="text-subtitle-1 font-weight-regular textSecondary ml-2">{{ user?.email }}</span>
                        </div>
                    </div>
                </div>
                <v-divider></v-divider>
            </div>
            <div class="pt-4 pb-6 px-8 text-center">
                <v-btn color="primary" variant="text" block class="mb-2" @click="goToProfile()">
                    <UserIcon size="18" stroke-width="1.5" class="mr-2" />
                    {{ $t('profile.title') }}
                </v-btn>
                <v-btn color="primary" variant="outlined" block :loading="loading" :disabled="loading" @click="logout()">
                    {{ loading ? $t('common.loggingOut') : $t('common.logout') }}
                </v-btn>
            </div>
        </v-sheet>
    </v-menu>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { MailIcon, UserIcon } from 'vue-tabler-icons';
import { useAuthStore } from '@/modules/authentication/stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const loading = computed(() => authStore.loading);
const user = computed(() => authStore.user);

// Iniciales de los dos primeros nombres; sin nombre, cae al username.
const initials = computed(() => {
    const parts = (user.value?.name ?? '').trim().split(/\s+/).filter(Boolean);

    if (parts.length > 1) {
        return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    }

    if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase();
    }

    return (user.value?.username ?? '').slice(0, 2).toUpperCase();
});

// Se oculta cuando el username es igual al email (admin inicial del tenant).
const showUsername = computed(() => !!user.value?.username && user.value.username !== user.value.email);

function goToProfile() {
    router.push({ name: 'profile' });
}

async function logout() {
    await authStore.logout();
    router.push({ name: 'login' });
}
</script>
