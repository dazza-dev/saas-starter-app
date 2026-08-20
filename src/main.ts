import '@mdi/font/css/materialdesignicons.css';
import 'vue3-toastify/dist/index.css';
import '@vuepic/vue-datepicker/dist/main.css';

import { createApp } from 'vue';
import { registerCanDirective } from '@/core/directives/can';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './routes/router';

// Vue Abilities
import { abilitiesPlugin } from '@casl/vue';
import ability from './core/plugins/ability';

import { PerfectScrollbarPlugin } from 'vue3-perfect-scrollbar';
import VueApexCharts from 'vue3-apexcharts';
import VueTablerIcons from 'vue-tabler-icons';
import { IconEye, IconPencil, IconTrash } from '@tabler/icons-vue';
import VuetifyDatatable, { createDataTableConfig } from '@dazzadev/vuetify-datatable';

// Maska
import { vMaska } from 'maska/vue';

// ScrollTop
import VueScrollTo from 'vue-scrollto';

// Kit compartido: tema, layouts, componentes globales y utilidades de app
import {
    createAppVuetify,
    VuetifyAppKit,
    setCustomizerDefaults,
    setupI18n,
    configureLogger,
    Languages,
    LogoComponentKey,
    HeaderLeftWidgetsKey,
    HeaderRightWidgetsKey,
    SidebarItemsKey
} from 'vuetify-app-kit';
import 'vuetify-app-kit/styles';
import '@/assets/scss/_custom.scss';
import '@/assets/scss/auth.scss';
import messages from '@/locales/messages';
import Logo from '@/core/components/AppLogo.vue';

// Widgets del header
import Navigation from '@/core/widgets/NavigationMenu.vue';
import Notifications from '@/core/widgets/NotificationsMenu.vue';
import Profile from '@/core/widgets/ProfileMenu.vue';

// Elementos del sidebar
import { sidebarItems } from '@/core/sidebar/useSidebarItems';

// Toasty
import Vue3Toasity, { type ToastContainerOptions } from 'vue3-toastify';
const toastOptions: ToastContainerOptions = {
    position: 'top-center',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    theme: 'colored'
};

// VueDatePicker
import { VueDatePicker } from '@vuepic/vue-datepicker';

// Sentry
import * as Sentry from '@sentry/vue';

// Crear App
const app = createApp(App);

// Sentry solo si hay DSN configurado.
if (import.meta.env.VITE_SENTRY_DSN) {
    Sentry.init({
        app,
        dsn: import.meta.env.VITE_SENTRY_DSN,
        environment: import.meta.env.MODE
    });
}

// Debe ir antes de cualquier llamada a logger.*
configureLogger({
    isDev: import.meta.env.DEV,
    sentryEnabled: !!import.meta.env.VITE_SENTRY_DSN
});

app.use(createPinia());

// Mueve la configuración del store ANTES de usar el router
const i18nInstance = setupI18n({ messages, defaultLocale: 'es' })!;
app.use(i18nInstance);

const vuetify = createAppVuetify(i18nInstance);
app.use(vuetify);

// Theme
setCustomizerDefaults({
    // Cambia aquí el tema por defecto de tu SaaS. Los temas viven en vuetify-app-kit.
    activeTheme: 'DEFAULT_THEME',
    boxed: false,
    borderCard: false
});
app.use(VuetifyAppKit, {
    errorPage: {
        titleKey: 'common.errorPage.notFound.title',
        descriptionKey: 'common.errorPage.notFound.description',
        backToHomeKey: 'common.errorPage.notFound.goHome'
    }
});
app.use(abilitiesPlugin, ability, {
    useGlobalProperties: true
});
app.use(PerfectScrollbarPlugin);
app.use(VueTablerIcons);
app.use(VuetifyDatatable);
app.use(
    createDataTableConfig({
        icons: {
            view: IconEye,
            edit: IconPencil,
            delete: IconTrash
        },
        iconProps: { 'stroke-width': 1.5 },
        tableClass: 'border rounded-md'
    })
);
app.directive('maska', vMaska);
registerCanDirective(app);
app.use(VueApexCharts);
app.use(Vue3Toasity, toastOptions);

// Claves de inyección del tema
app.provide(LogoComponentKey, Logo);
app.provide(HeaderLeftWidgetsKey, [Navigation]);
app.provide(HeaderRightWidgetsKey, [Languages, Notifications, Profile]);
app.provide(SidebarItemsKey, sidebarItems);

// Componentes
app.component('VueDatePicker', VueDatePicker);

// Uso de ScrollTop
app.use(VueScrollTo, {
    duration: 1000,
    easing: 'ease'
});

// Instala el router AL FINAL (después de pinia y plugins)
app.use(router);

// Montar APP
app.mount('#app');
