import { en as enVuetify, es as esVuetify, pt as ptVuetify } from 'vuetify/locale';

// Al añadir un módulo, impórtalo aquí en los tres idiomas.

// English
import enCommon from '@/locales/en/common.json';
import enSidebar from '@/locales/en/sidebar.json';
import enLogin from '@/modules/authentication/locales/en.json';
import enProfile from '@/modules/authentication/profile/locales/en.json';
import enUsers from '@/modules/users/locales/en.json';
import enGroups from '@/modules/configs/groups/locales/en.json';
import enRoles from '@/modules/configs/roles/locales/en.json';
import enSettings from '@/modules/configs/settings/locales/en.json';
import enDashboard from '@/modules/dashboard/locales/en.json';

// Español
import esCommon from '@/locales/es/common.json';
import esSidebar from '@/locales/es/sidebar.json';
import esLogin from '@/modules/authentication/locales/es.json';
import esProfile from '@/modules/authentication/profile/locales/es.json';
import esUsers from '@/modules/users/locales/es.json';
import esGroups from '@/modules/configs/groups/locales/es.json';
import esRoles from '@/modules/configs/roles/locales/es.json';
import esSettings from '@/modules/configs/settings/locales/es.json';
import esDashboard from '@/modules/dashboard/locales/es.json';

// Português
import ptCommon from '@/locales/pt/common.json';
import ptSidebar from '@/locales/pt/sidebar.json';
import ptLogin from '@/modules/authentication/locales/pt.json';
import ptProfile from '@/modules/authentication/profile/locales/pt.json';
import ptUsers from '@/modules/users/locales/pt.json';
import ptGroups from '@/modules/configs/groups/locales/pt.json';
import ptRoles from '@/modules/configs/roles/locales/pt.json';
import ptSettings from '@/modules/configs/settings/locales/pt.json';
import ptDashboard from '@/modules/dashboard/locales/pt.json';

const messages = {
    en: {
        $vuetify: enVuetify,
        common: enCommon,
        sidebar: enSidebar,
        login: enLogin,
        profile: enProfile,
        users: enUsers,
        groups: enGroups,
        roles: enRoles,
        settings: enSettings,
        dashboard: enDashboard,
        authError: {
            oops: 'Oops!',
            message: 'This page could not be found.',
            goHome: 'Go Back to Home'
        }
    },
    es: {
        $vuetify: esVuetify,
        common: esCommon,
        sidebar: esSidebar,
        login: esLogin,
        profile: esProfile,
        users: esUsers,
        groups: esGroups,
        roles: esRoles,
        settings: esSettings,
        dashboard: esDashboard,
        authError: {
            oops: '¡Ups!',
            message: 'No se encontró esta página.',
            goHome: 'Volver al inicio'
        }
    },
    pt: {
        $vuetify: ptVuetify,
        common: ptCommon,
        sidebar: ptSidebar,
        login: ptLogin,
        profile: ptProfile,
        users: ptUsers,
        groups: ptGroups,
        roles: ptRoles,
        settings: ptSettings,
        dashboard: ptDashboard,
        authError: {
            oops: 'Ops!',
            message: 'Esta página não foi encontrada.',
            goHome: 'Voltar ao início'
        }
    }
};

export default messages;
