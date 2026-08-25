import router from '@/routes/router';
import axios from 'axios';
import applyCaseMiddleware from 'axios-case-converter';
import { getTenantFromPath } from 'vuetify-app-kit';
import { getTenantItem } from '@/core/utils/tenantStorage';
import { getBaseUrl } from './common';

const axiosServices = applyCaseMiddleware(
    axios.create({
        baseURL: getBaseUrl() + '/api',
        withCredentials: true,
        withXSRFToken: true
    })
);

axiosServices.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const url: string = error.config?.url ?? '';
            // Don't redirect on session checks — let isAuthenticated() handle it
            const isSessionCheck = url.includes('auth/profile');
            if (!isSessionCheck) {
                router.push({ name: 'login' });
            }
            return Promise.reject('Unauthorized');
        }
        return Promise.reject((error.response && error.response.data) || 'Wrong Services');
    }
);

axiosServices.interceptors.request.use((config) => {
    const tenant = getTenantFromPath();
    if (tenant) {
        config.headers['X-Tenant'] = tenant;
    }

    const lang = getTenantItem('lang');
    if (lang) {
        config.headers['Accept-Language'] = lang;
    }

    return config;
});

export default axiosServices;
