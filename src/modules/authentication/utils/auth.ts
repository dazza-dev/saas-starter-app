import { useAuthStore } from '@/modules/authentication/stores/auth';

export async function isAuthenticated() {
    const store = useAuthStore();

    if (store.user !== null) {
        return true;
    }

    // Tras recargar la pagina el store esta vacio: se comprueba la cookie contra el perfil.
    try {
        await store.profile();
        return true;
    } catch {
        return false;
    }
}
