<template>
    <div class="d-flex justify-center align-center text-center h-100vh">
        <div>
            <img src="@/assets/images/backgrounds/errorimg.svg" width="500" alt="404" />
            <h1 class="text-h1 pt-3">{{ $t('authError.oops') }}</h1>
            <h4 class="text-h4 my-8">{{ $t('authError.message') }}</h4>
            <v-btn flat color="primary" class="mb-4" to="/">{{ $t('authError.goHome') }}</v-btn>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
useI18n();
</script>
