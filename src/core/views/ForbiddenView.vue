<template>
    <v-container class="fill-height">
        <v-row justify="center" align="center">
            <v-col cols="12" md="6" class="text-center">
                <v-icon size="96" color="warning" class="mb-6">mdi-lock-outline</v-icon>
                <h1 class="text-h4 font-weight-bold mb-3">{{ t('common.forbiddenTitle') }}</h1>
                <p class="text-body-1 text-medium-emphasis mb-8">{{ t('common.forbiddenMessage') }}</p>
                <v-btn color="primary" flat size="large" :to="{ name: 'app-dashboard' }">
                    {{ t('common.backToHome') }}
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>
