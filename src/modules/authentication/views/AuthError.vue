<template>
    <div class="d-flex flex-column align-center justify-center text-center h-100vh px-4">
        <div class="not-found-art text-primary">
            <NotFoundArt />
        </div>
        <h1 class="text-h4 font-weight-bold mt-10">{{ t('authError.oops') }}</h1>
        <p class="text-body-1 text-medium-emphasis mt-3 not-found-text">{{ t('authError.message') }}</p>
        <v-btn flat color="primary" class="mt-8" to="/">{{ t('authError.goHome') }}</v-btn>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { NotFoundArt } from 'vuetify-app-kit';

const { t } = useI18n();
</script>

<style scoped>
.not-found-art {
    width: 100%;
    max-width: 380px;
}

.not-found-text {
    max-width: 420px;
}
</style>
