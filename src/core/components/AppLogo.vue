<template>
    <img v-if="uploadedLogo" class="logo-src" :src="uploadedLogo" :alt="alt" />
    <!-- eslint-disable-next-line vue/no-v-html -- it's a bundled asset, no user input goes in -->
    <span v-else class="logo-src" :style="{ color: inkColor }" role="img" :aria-label="alt" v-html="markup"></span>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue';
import { useTheme } from 'vuetify';
import { useConfigStore } from '@/core/stores/config';
import logoMarkup from '@/assets/images/logo.svg?raw';

/**
 * Tenant logo, where `light` is white ink for the sidebar and `dark` takes the theme color.
 */
const props = withDefaults(
    defineProps<{
        variant?: 'light' | 'dark';
        alt?: string;
    }>(),
    {
        variant: 'light',
        alt: ''
    }
);

const configStore = useConfigStore();
const theme = useTheme();
const uid = useId();

// The logo the tenant uploads is their brand: shown as-is, untinted.
const uploadedLogo = computed(() => {
    const key = props.variant === 'dark' ? 'logo' : 'logo_dark';

    return (configStore.settings[key] as string) || null;
});

const inkColor = computed(() => (props.variant === 'light' ? '#FFFFFF' : String(theme.current.value.colors.primary)));

// The mask id is unique per instance: two logos on the same page would clash.
const markup = computed(() => logoMarkup.replace(/logoMarkCutout/g, `logoMark-${uid}`));
</script>

<style scoped>
.logo-src :deep(svg) {
    display: block;
    max-width: 100%;
    height: auto;
}
</style>
