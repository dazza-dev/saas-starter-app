import { ref } from 'vue';
import { defineStore } from 'pinia';
import axios from '@/core/utils/axios';
import { useApiCall } from 'vuetify-app-kit';

type SettingValue = string | number | boolean | null | unknown[];
type Settings = Record<string, SettingValue>;
type SettingPayload = { name: string; value: string };

export const useConfigStore = defineStore('Config', () => {
    const loading = ref(false);
    const settings = ref<Settings>({});
    const apiCall = useApiCall(loading);

    async function getSettings() {
        await apiCall(async () => {
            const { data } = await axios.get('v1/settings');
            settings.value = data.data;
        }, 'Error fetching settings:');
    }

    async function updateSettings(payload: SettingPayload[]) {
        await apiCall(async () => {
            await axios.put('v1/settings', { settings: payload });
            await getSettings();
        }, 'Error updating settings:');
    }

    async function uploadLogo(file: File, type?: string): Promise<string> {
        return apiCall(async () => {
            const formData = new FormData();
            formData.append('file', file);
            if (type) formData.append('type', type);
            const { data } = await axios.post('v1/settings/upload-logo', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return data.url as string;
        }, 'Error uploading logo:') as Promise<string>;
    }

    return { loading, settings, getSettings, updateSettings, uploadLogo };
});
