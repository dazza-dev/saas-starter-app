import { computed, ref } from 'vue';
import axios from '@/core/utils/axios';
import { useApiCall } from 'vuetify-app-kit';
import type { AppSettings, SettingsApiResponse } from '../types/Settings';

const DEFAULT_SETTINGS: AppSettings = {
    appName: '',
    email: '',
    notificationEmail: '',
    language: 'en',
    timezone: 'UTC',
    appTheme: 'DEFAULT_THEME',
    logo: null,
    logoDark: null
};

export function useSettings() {
    const loading = ref(false);
    const saving = ref(false);
    const apiCall = useApiCall(loading);
    const saveApiCall = useApiCall(saving);

    const settings = ref<AppSettings>({ ...DEFAULT_SETTINGS });
    // Copy of the last server response, used to detect unsaved changes.
    const loaded = ref<AppSettings>({ ...DEFAULT_SETTINGS });
    const dirty = computed(() => JSON.stringify(settings.value) !== JSON.stringify(loaded.value));

    async function loadSettings() {
        return apiCall(async () => {
            const response = await axios.get<{ data: SettingsApiResponse }>('v1/settings');
            const s = response.data.data;

            settings.value = {
                appName: s.appName ?? '',
                email: s.email ?? '',
                notificationEmail: s.notificationEmail ?? '',
                language: s.language ?? DEFAULT_SETTINGS.language,
                timezone: s.timezone ?? DEFAULT_SETTINGS.timezone,
                appTheme: s.appTheme ?? DEFAULT_SETTINGS.appTheme,
                logo: s.logo ?? null,
                logoDark: s.logoDark ?? null
            };
            loaded.value = { ...settings.value };
        }, 'Error loading settings:');
    }

    async function saveSettings() {
        return saveApiCall(async () => {
            // `name` values are literal DB identifiers, not keys to convert: keep them snake_case.
            const bulk = [
                { name: 'app_name', value: settings.value.appName },
                { name: 'email', value: settings.value.email },
                { name: 'notification_email', value: settings.value.notificationEmail },
                { name: 'language', value: settings.value.language },
                { name: 'timezone', value: settings.value.timezone },
                { name: 'app_theme', value: settings.value.appTheme },
                { name: 'logo', value: settings.value.logo },
                { name: 'logo_dark', value: settings.value.logoDark }
            ];

            await axios.put('v1/settings', { settings: bulk });
            loaded.value = { ...settings.value };
        }, 'Error saving settings:');
    }

    return { loading, saving, settings, dirty, loadSettings, saveSettings };
}
