import '@mdi/font/css/materialdesignicons.css';
import 'vue3-toastify/dist/index.css';
import '@vuepic/vue-datepicker/dist/main.css';

import { createApp } from 'vue';
import { registerCanDirective } from '@/core/directives/can';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './routes/router';

import { abilitiesPlugin } from '@casl/vue';
import ability from './core/plugins/ability';

import { PerfectScrollbarPlugin } from 'vue3-perfect-scrollbar';
import VueApexCharts from 'vue3-apexcharts';
import VueTablerIcons from 'vue-tabler-icons';
import { IconEye, IconPencil, IconTrash } from '@tabler/icons-vue';
import VuetifyDatatable, { createDataTableConfig } from '@dazzadev/vuetify-datatable';

import { vMaska } from 'maska/vue';

import VueScrollTo from 'vue-scrollto';

// Shared kit: theme, layouts, global components and app utilities
import {
    createAppVuetify,
    VuetifyAppKit,
    setCustomizerDefaults,
    setupI18n,
    configureLogger,
    LanguagesMenu,
    ModeToggle,
    LogoComponentKey,
    LogoLinkKey,
    HeaderLeftWidgetsKey,
    HeaderRightWidgetsKey,
    SidebarItemsKey
} from 'vuetify-app-kit';
import 'vuetify-app-kit/styles';
import '@/assets/scss/_custom.scss';
import '@/assets/scss/auth.scss';
import messages from '@/locales/messages';
import Logo from '@/core/components/AppLogo.vue';

// Header widgets
import Navigation from '@/core/widgets/NavigationMenu.vue';
import Notifications from '@/core/widgets/NotificationsMenu.vue';
import Profile from '@/core/widgets/ProfileMenu.vue';

import { sidebarItems } from '@/core/sidebar/useSidebarItems';

import Vue3Toasity, { type ToastContainerOptions } from 'vue3-toastify';
const toastOptions: ToastContainerOptions = {
    position: 'top-center',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    theme: 'colored'
};

import { VueDatePicker } from '@vuepic/vue-datepicker';

import * as Sentry from '@sentry/vue';

const app = createApp(App);

// Sentry only if a DSN is configured.
if (import.meta.env.VITE_SENTRY_DSN) {
    Sentry.init({
        app,
        dsn: import.meta.env.VITE_SENTRY_DSN,
        environment: import.meta.env.MODE
    });
}

// Must run before any logger.* call
configureLogger({
    isDev: import.meta.env.DEV,
    sentryEnabled: !!import.meta.env.VITE_SENTRY_DSN
});

app.use(createPinia());

// Move store setup BEFORE using the router
const i18nInstance = setupI18n({ messages, defaultLocale: 'en' })!;
app.use(i18nInstance);

const vuetify = createAppVuetify(i18nInstance);
app.use(vuetify);

setCustomizerDefaults({
    // Colour palette; the themes live in vuetify-app-kit.
    activeTheme: 'DEFAULT_THEME',
    // Starts in light mode; the header toggle overrides it and remembers the choice.
    darkMode: false,
    // Starts expanded; the sidebar button overrides it and remembers the choice.
    miniSidebar: false,
    // Centre the content and cap it at 1200px; off, it fills the width.
    boxed: false,
    // Outline cards with a border instead of a shadow.
    borderCard: true
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

// Layout injection keys
app.provide(LogoComponentKey, Logo);
app.provide(LogoLinkKey, { name: 'app-dashboard' });
app.provide(HeaderLeftWidgetsKey, [Navigation]);
app.provide(HeaderRightWidgetsKey, [ModeToggle, Notifications, LanguagesMenu, Profile]);
app.provide(SidebarItemsKey, sidebarItems);

app.component('VueDatePicker', VueDatePicker);

app.use(VueScrollTo, {
    duration: 1000,
    easing: 'ease'
});

// Install the router last, after pinia and plugins
app.use(router);

app.mount('#app');
