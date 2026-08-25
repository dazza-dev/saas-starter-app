<template>
    <RouterView></RouterView>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { RouterView } from 'vue-router';
import { useSidebarItems } from '@/core/sidebar/useSidebarItems';
import { useConfigStore } from '@/core/stores/config';
import { useCustomizerStore, setDefaultLanguage } from 'vuetify-app-kit';
import type { ThemeName } from 'vuetify-app-kit';

useSidebarItems();

const configStore = useConfigStore();
const customizerStore = useCustomizerStore();

// The backend defines the theme, and the language too unless the user already picked one.
watch(
    () => configStore.settings.appTheme,
    (theme) => {
        if (theme) customizerStore.setTheme(theme as ThemeName);
    },
    { immediate: true }
);

watch(
    () => configStore.settings.language,
    (language) => setDefaultLanguage(language as string | undefined),
    { immediate: true }
);
</script>
