import type { ThemeName } from 'vuetify-app-kit';

// Configuración tal y como llega de `GET v1/settings`, ya en camelCase.
export interface SettingsApiResponse {
    appName: string | null;
    email: string | null;
    notificationEmail: string | null;
    language: string | null;
    timezone: string | null;
    appTheme: ThemeName;
    logo: string | null;
    logoDark: string | null;
}

export interface AppSettings {
    appName: string;
    email: string;
    notificationEmail: string;
    language: string;
    timezone: string;
    appTheme: ThemeName;
    logo: string | null;
    logoDark: string | null;
}
