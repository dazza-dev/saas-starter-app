import { toast, type ToastOptions } from 'vue3-toastify';

export function notify(toastType: ToastOptions['type'], message: string) {
    toast(message, {
        type: toastType
    });
}

export function getBaseUrl(): string {
    return import.meta.env.VITE_API_URL || window.location.origin;
}
