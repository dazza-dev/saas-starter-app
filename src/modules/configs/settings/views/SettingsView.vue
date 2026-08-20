<template>
    <PageHeader :title="t('settings.title')" :subtitle="t('settings.subtitle')" />

    <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-4" />

    <v-tabs v-model="activeTab" color="primary" class="mb-5">
        <v-tab value="general">{{ t('settings.tabs.general') }}</v-tab>
        <v-tab value="design">{{ t('settings.tabs.design') }}</v-tab>
    </v-tabs>

    <v-row>
        <v-col cols="12" md="7">
            <v-tabs-window v-model="activeTab">
                <!-- General -->
                <v-tabs-window-item value="general">
                    <ParentCard :title="t('settings.generalInfo')">
                        <v-row>
                            <v-col cols="12">
                                <AppInput v-model="settings.appName" :label="t('settings.appName')" density="compact" />
                            </v-col>
                            <v-col cols="12" sm="6">
                                <AppInput v-model="settings.email" :label="t('settings.email')" density="compact" type="email" />
                            </v-col>
                            <v-col cols="12" sm="6">
                                <AppInput
                                    v-model="settings.notificationEmail"
                                    :label="t('settings.notificationEmail')"
                                    density="compact"
                                    type="email"
                                />
                            </v-col>
                            <v-col cols="12" sm="6">
                                <AppSelect
                                    v-model="settings.language"
                                    :items="languageOptions"
                                    :label="t('settings.language')"
                                    density="compact"
                                />
                            </v-col>
                            <v-col cols="12" sm="6">
                                <AppInput v-model="settings.timezone" :label="t('settings.timezone')" density="compact" />
                            </v-col>
                        </v-row>

                        <template v-slot:footer>
                            <div class="d-flex justify-end gap-3">
                                <v-btn variant="outlined" @click="loadSettings">{{ t('settings.cancel') }}</v-btn>
                                <v-btn v-can="'update-config'" color="primary" :loading="saving" @click="save">
                                    {{ t('settings.save') }}
                                </v-btn>
                            </div>
                        </template>
                    </ParentCard>
                </v-tabs-window-item>

                <!-- Diseño -->
                <v-tabs-window-item value="design">
                    <ParentCard :title="t('settings.tabs.design')">
                        <div class="text-subtitle-1 font-weight-medium mb-3">{{ t('settings.appTheme') }}</div>
                        <div class="d-flex flex-wrap gap-3 mb-8">
                            <div
                                v-for="theme in appThemes"
                                :key="theme.value"
                                class="theme-swatch cursor-pointer"
                                :class="{ selected: settings.appTheme === theme.value }"
                                :title="t('settings.themes.' + theme.key)"
                                @click="settings.appTheme = theme.value"
                            >
                                <div class="theme-swatch__primary" :style="{ background: theme.primary }" />
                                <div class="theme-swatch__secondary" :style="{ background: theme.secondary }" />
                            </div>
                        </div>

                        <div class="text-subtitle-1 font-weight-medium mb-3">{{ t('settings.logo') }}</div>
                        <LogoUploader
                            v-model="logoUrl"
                            :upload-fn="configStore.uploadLogo"
                            accept="image/png,image/jpeg"
                            :help-text="t('settings.logoHint')"
                        />

                        <template v-slot:footer>
                            <div class="d-flex justify-end gap-3">
                                <v-btn variant="outlined" @click="loadSettings">{{ t('settings.cancel') }}</v-btn>
                                <v-btn v-can="'update-config'" color="primary" :loading="saving" @click="save">
                                    {{ t('settings.save') }}
                                </v-btn>
                            </div>
                        </template>
                    </ParentCard>
                </v-tabs-window-item>
            </v-tabs-window>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSettings } from '../composables/useSettings';
import { useConfigStore } from '@/core/stores/config';
import { notify } from '@/core/utils/common';
import { AppInput, AppSelect, LogoUploader } from 'vuetify-app-kit';
import type { ThemeName } from 'vuetify-app-kit';

const { t } = useI18n();
const { loading, saving, settings, loadSettings, saveSettings } = useSettings();
const configStore = useConfigStore();

const activeTab = ref('general');

// Añade aquí los idiomas que soportes, con su archivo en src/locales/.
const languageOptions = [
    { title: 'Español', value: 'es' },
    { title: 'English', value: 'en' },
    { title: 'Português', value: 'pt' }
];

const logoUrl = computed({
    get: () => settings.value.logo ?? '',
    set: (val: string) => {
        settings.value.logo = val || null;
    }
});

const appThemes: { value: ThemeName; key: string; primary: string; secondary: string }[] = [
    { value: 'EMERALD_THEME', key: 'emerald', primary: '#00c853', secondary: '#12161C' },
    { value: 'DEFAULT_THEME', key: 'default', primary: '#562ff4', secondary: '#49BEFF' },
    { value: 'BLUE_THEME', key: 'blue', primary: '#5D87FF', secondary: '#49BEFF' },
    { value: 'AQUA_THEME', key: 'aqua', primary: '#0074BA', secondary: '#47D7BC' },
    { value: 'PURPLE_THEME', key: 'purple', primary: '#763EBD', secondary: '#95CFD5' },
    { value: 'GREEN_THEME', key: 'green', primary: '#0A7EA4', secondary: '#CCDA4E' },
    { value: 'CYAN_THEME', key: 'cyan', primary: '#01C0C8', secondary: '#FB9678' },
    { value: 'ORANGE_THEME', key: 'orange', primary: '#FA896B', secondary: '#0074BA' }
];

async function save() {
    try {
        await saveSettings();
        notify('success', t('settings.saveSuccess'));
        await Promise.all([loadSettings(), configStore.getSettings()]);
    } catch {
        notify('error', t('settings.saveError'));
    }
}

onMounted(() => loadSettings());
</script>

<style scoped>
.theme-swatch {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    overflow: hidden;
    display: grid;
    grid-template-columns: 1fr 1fr;
    border: 2px solid transparent;
    transition:
        border-color 0.15s,
        box-shadow 0.15s;
}

.theme-swatch:hover {
    filter: brightness(0.92);
}

.theme-swatch.selected {
    border-color: #333;
    box-shadow: 0 0 0 2px white inset;
}

.theme-swatch__primary,
.theme-swatch__secondary {
    height: 100%;
}
</style>
