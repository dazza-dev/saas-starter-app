import { getTenantStorageKey } from 'vuetify-app-kit';

/**
 * localStorage acotado al tenant, que se aísla por origen y no por ruta.
 */
export function getTenantItem(key: string): string | null {
    return localStorage.getItem(getTenantStorageKey(key));
}

export function setTenantItem(key: string, value: string): void {
    localStorage.setItem(getTenantStorageKey(key), value);
}

export function removeTenantItem(key: string): void {
    localStorage.removeItem(getTenantStorageKey(key));
}
