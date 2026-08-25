import { getTenantStorageKey } from 'vuetify-app-kit';

/**
 * Tenant-scoped localStorage, isolated by origin rather than by route.
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
