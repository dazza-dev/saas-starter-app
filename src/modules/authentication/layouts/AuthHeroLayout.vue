<template>
    <div class="pa-3">
        <v-row class="h-100vh auth">
            <v-col cols="12" lg="6" xl="6" class="d-none d-lg-flex align-center justify-center auth-hero-section" :style="heroBgStyle">
            </v-col>
            <v-col cols="12" lg="6" xl="6" class="d-flex align-center justify-center auth-form-section">
                <div class="mt-xl-0 mt-5 auth-form-content">
                    <slot />
                </div>
            </v-col>
        </v-row>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTheme } from 'vuetify';

const theme = useTheme();

const heroBgStyle = computed(() => ({
    // The theme types the color as a union, but at runtime it's always a hex.
    backgroundColor: String(theme.current.value.colors.primary)
}));
</script>

<style scoped>
.pa-3 {
    height: 100vh;
    padding: 0 !important;
    overflow: hidden;
}

.auth {
    height: 100vh !important;
    max-height: 100vh !important;
    margin: 0 !important;
    flex-wrap: nowrap !important;
    overflow: hidden;
}

.auth-hero-section,
.auth-form-section {
    height: 100vh !important;
    max-height: 100vh !important;
    min-height: 0 !important;
}

.auth-form-section {
    overflow-y: auto;
    flex-direction: column !important;
    flex-wrap: nowrap !important;
    justify-content: flex-start !important;
}

.auth-form-section .auth-form-content {
    margin: auto !important;
    padding-block: 24px;
}
</style>
