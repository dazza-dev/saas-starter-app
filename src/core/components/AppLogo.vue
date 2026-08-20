<template>
    <img v-if="uploadedLogo" class="logo-src" :src="uploadedLogo" :alt="alt" />
    <!-- eslint-disable-next-line vue/no-v-html -- es un asset propio, no entra nada del usuario -->
    <span v-else class="logo-src" :style="{ color: inkColor }" role="img" :aria-label="alt" v-html="markup"></span>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue';
import { useTheme } from 'vuetify';
import { useConfigStore } from '@/core/stores/config';
import logoMarkup from '@/assets/images/logo.svg?raw';

/**
 * Logo del tenant. `light` es tinta blanca para el sidebar y `dark` toma el color del tema.
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

// El logo que sube el tenant es su marca: se muestra tal cual, sin teñir.
const uploadedLogo = computed(() => {
    const key = props.variant === 'dark' ? 'logo' : 'logo_dark';

    return (configStore.settings[key] as string) || null;
});

const inkColor = computed(() => (props.variant === 'light' ? '#FFFFFF' : String(theme.current.value.colors.primary)));

// El id del mask se hace único por instancia: dos logos en la misma página chocarían.
const markup = computed(() => logoMarkup.replace(/logoMarkCutout/g, `logoMark-${uid}`));
</script>

<style scoped>
.logo-src :deep(svg) {
    display: block;
    max-width: 100%;
    height: auto;
}
</style>
