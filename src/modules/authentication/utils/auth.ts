import { useAuthStore } from '@/modules/authentication/stores/auth';

export async function isAuthenticated() {
    const store = useAuthStore();

    if (store.user !== null) {
        return true;
    }

    // After a page reload the store is empty: check the cookie against the profile.
    try {
        await store.profile();
        return true;
    } catch {
        return false;
    }
}
