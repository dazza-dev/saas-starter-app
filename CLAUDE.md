# SaaS Starter App — Development Rules

## Stack

- Vue 3.5, Vite 8, TypeScript 6
- **Vuetify 4.1** (component library)
- Vue Router 5.1, Pinia 3, Vue i18n 11
- Vuelidate 2 for form validation, CASL for permissions
- `axios-case-converter` middleware on the axios instance (auto-converts snake_case ↔ camelCase)
- `vuetify-app-kit` package — the shared frontend foundation, in one dependency:
    - layouts (`FullLayout`, `BlankLayout`), globally registered components (`PageHeader`, `ParentCard`, `FormCard`, `Tag`, `ConfirmationModal`…), themes and SCSS
    - app utilities: `useApiCall`, `getErrorMessage`, `DEFAULT_ITEMS_PER_PAGE`, `getTenantFromPath`, `setupI18n`, `useI18nTranslation`, `logger`
- `@dazzadev/vuetify-datatable` package (`DataTable` component, `LoadDataParams` type)

---

## Comments (Comentarios)

- **Language:** every comment is written in **Spanish**. The code itself — names of variables, functions, components, composables, fields, types — stays in **English**. Only the prose of comments is translated.
- **Function / composable / class docblocks:** always use the **multi-line block** form (JSDoc `/** ... */`) spanning **at least 3 lines**, even when the text is a single line.
- **Inline comments inside a function body:** a single-line `//` comment is fine — do NOT expand these to blocks.

---

## Module Structure

Every feature lives in `src/modules/{domain}/{feature}/` (or `src/modules/{domain}/` for top-level domains):

```
src/modules/configs/groups/
├── composables/
│   ├── useGroup.ts            # API calls
│   ├── useGroupForm.ts        # Form state + Vuelidate + save logic
│   └── useGroupPageConfig.ts  # headers, breadcrumbs, page title
├── locales/{en,es,pt}.json
├── routes/GroupsRoutes.ts
├── types/Group.ts
└── views/
    ├── GroupList.vue
    └── GroupForm.vue
```

Modules that ship with the starter:

| Domain           | Contents                          |
| ---------------- | --------------------------------- |
| `authentication` | Login, auto-login, profile        |
| `dashboard`      | Landing screen after login        |
| `users`          | **Reference CRUD** — tenant users |
| `configs`        | `groups`, `roles`, `settings`     |

> `configs/groups` is the **smallest complete example** of the module pattern. Copy it when creating a new module. `users` is the fuller example: relations, options loading, richer validation.

---

## Multitenancy

This is a multi-tenant SPA. Each tenant is identified by a domain registered in `saas-starter-admin`.

- `getTenantFromPath()` (from `vuetify-app-kit`) reads the tenant identifier from the current URL path — the app is served under `/{tenant}/`
- The axios instance automatically sends `X-Tenant: {tenant}` on every request via its request interceptor — never add this header manually
- Never hardcode a tenant identifier anywhere in the codebase
- Requests with an unknown tenant get a 404, which the router turns into the "not found" page
- Without a tenant in the URL the router only mounts the `tenant-select` screen, which asks for the account name and redirects to `/{tenant}/auth/login`

### Local storage

`localStorage` is isolated per origin, never per path. The app serves every tenant from one origin
with the tenant in the path, so an unprefixed key is shared by all of them. Always read and write
through `src/core/utils/tenantStorage.ts` (`getTenantItem` / `setTenantItem` / `removeTenantItem`),
which prefix the key with the current tenant. Never call `localStorage` directly.

---

## API Calls

All API calls go through `src/core/utils/axios` (pre-configured instance):

- `baseURL` = `getBaseUrl() + '/api'`
- `withCredentials: true`, `withXSRFToken: true` (session-based cookie auth)
- `axios-case-converter` middleware applied
- Request interceptor adds `X-Tenant` and `Accept-Language`
- Response interceptor redirects to login on 401 (except `auth/profile` calls)

URL pattern: pass the path **relative to** `/api` — i.e. starting from `v1/`:

```ts
axios.get('v1/groups');
axios.post('v1/groups', form);
```

All keys in `params: {}` objects and request bodies **must be camelCase** — `axios-case-converter` converts them to snake_case on the wire automatically:

```ts
// ✓ correct
axios.get('v1/users', { params: { perPage: 15, roleUuid: uuid } });

// ✗ wrong — snake_case keys
axios.get('v1/users', { params: { per_page: 15, role_uuid: uuid } });
```

Wrap every call with `useApiCall(loading)`:

```ts
const loading = ref(false);
const apiCall = useApiCall(loading);

async function getGroups(params) {
    return apiCall(async () => {
        const response = await axios.get<{ data: Group[]; meta: { total: number } }>('v1/groups', { params });
        groups.value = response.data.data;
        totalItems.value = response.data.meta.total;
        return response;
    }, 'Error fetching groups:');
}
```

---

## Types

Rules:

- Never include `id` in entity interfaces — the API only returns `uuid`
- `uuid: string` is the public identifier on all entities
- `Form` interface contains only editable fields (no `uuid`)
- Filter fields that reference entity arrays must be `string[]` (UUIDs), never `number[]`
- No inline anonymous types for API-facing shapes — define a named `interface` in a `types/` file
- Shared utility types (`NamedOption`, `RoleOption`, `FilterType`, `HeaderTitleType`, `SidebarItem`) live in `src/core/types/common.type.ts` — import from there, never duplicate per-module

---

## UUID Convention

- Empty string `''` = creating mode
- Non-empty string = editing mode
- Never use numeric IDs (`-1`, `0`) as sentinel values

```ts
const isCreating = computed(() => props.groupUuid === '');
```

---

## Composables

Three per module, with one job each:

- `useXxx` — API layer. Returns `loading`, the data refs and the CRUD functions
- `useXxxForm` — form layer. Owns `editedItem`, the Vuelidate rules, `loadXxx`, `resetForm`, `saveXxx`. Validation rules live here, never in the component
- `useXxxPageConfig` — page chrome. Titles, breadcrumbs and table headers, refreshed on locale change via `useI18nTranslation`

Shared composables live in `src/core/composables/`. Never create module-level composables for data reused across the system — `useOptions()` already serves roles and groups from the dedicated `v1/settings/*` endpoints.

---

## Pinia Stores

All stores use the **composition API** form only:

```ts
// ✓ correct
export const useAuthStore = defineStore('auth', () => {
    const user = ref<AuthUser | null>(null);
    return { user };
});

// ✗ wrong — options API form
export const useAuthStore = defineStore('auth', { state: () => ({ user: null }) });
```

---

## Routing

Routes files export a plain object when they define a layout wrapper, or a spread array for children:

```ts
// src/routes/AppRoutes.ts
const AppRoutes = {
    path: '/app',
    meta: { requiresAuth: true, module: 'app' },
    component: FullLayout,
    children: [...UsersRoutes]
};
```

`route.meta.module` drives which sidebar renders. The starter ships one module, `'app'`.

Each route declares the permission it needs in `meta.permission`. The router guard denies and redirects to `/403` when the user lacks it. It can also be a function deriving the permission from route params.

---

## Permissions

- Permissions come from `v1/permissions/me` and are pushed into CASL by `useAuthStore.getPermissions()`
- An admin gets `manage all` rather than an enumerated list — a permission added tomorrow works without a redeploy
- Three ways to check, all backed by the same CASL ability: the router guard (`meta.permission`), the `v-can` directive in templates, and `ability.can()` in scripts
- The sidebar filters itself: an item whose permission the user lacks disappears, and a group left with no visible children disappears too

---

## Sidebar

`src/core/sidebar/useSidebarItems.ts` watches `route.meta.module` and resolves the sidebar from `sidebarModules`. All items for the main module are defined in `src/core/sidebar/sidebarApp.ts`.

When adding a new item, add it there with its `permission`. To add a whole new module with its own navigation, create `sidebarXxx.ts` and register it in `sidebarModules`.

---

## Internationalisation

Three languages: `en`, `es`, `pt`.

Each module has its own locale files in `module/locales/{en,es,pt}.json`. Register them in `src/locales/messages.ts` in **all three** blocks. Namespace key = feature name in camelCase.

All user-visible text in `.vue` templates **must** go through `t('...')` or `$t('...')`. Never hardcode Spanish or English labels, button text, column headers, or placeholders:

```html
<!-- ✓ correct -->
<v-btn>{{ t('groups.create.button') }}</v-btn>

<!-- ✗ wrong — hardcoded label -->
<v-btn>Crear grupo</v-btn>
```

---

## Core Components

Los componentes de UI **no viven en este proyecto**: los sirve `vuetify-app-kit`, para que todos los
SaaS compartan los mismos defaults. Se importan por nombre desde el paquete:

```ts
import { AppInput, AppSelect, AppModal } from 'vuetify-app-kit';
```

| Componente         | Propósito                                                 |
| ------------------ | --------------------------------------------------------- |
| `AppInput`         | Input de texto con soporte Vuelidate (`:v$="v$.field"`)   |
| `AppSelect`        | Select — envuelve `v-select` con los defaults compartidos |
| `AppAutocomplete`  | Autocomplete — envuelve `v-autocomplete`                  |
| `AppTextarea`      | Textarea — envuelve `v-textarea`                          |
| `AppPasswordInput` | Campo de contraseña con botón de mostrar/ocultar          |
| `AppColorPicker`   | Muestra de color + popup con `v-color-picker`             |
| `CountrySelect`    | Selector de país con bandera                              |
| `AppModal`         | Diálogo con cabecera y pie fijos; solo scrollea el cuerpo |
| `AppLink`          | Enlace de tabla/inline con el estilo compartido           |
| `LogoUploader`     | Subida de imagen con previsualización y validación        |

**Nunca uses `v-select`, `v-autocomplete` ni `v-textarea` en crudo** — usa siempre los envoltorios
`App*`. Fijan `variant="outlined"` y `hide-details`, propagan el resto de atributos con
`v-bind="$attrs"` y aceptan un `:v$` opcional para mostrar los errores de validación.

Los componentes de layout y presentación (`PageHeader`, `ParentCard`, `FormCard`, `Tag`,
`Breadcrumb`, `ConfirmationModal`, `PillTabs`, `TextItem`) también vienen de `vuetify-app-kit`, pero
su plugin los registra **globalmente** — esos no se importan.

El editor de texto enriquecido está en el subpath `vuetify-app-kit/editor` y necesita instalar tiptap
y remixicon, que son peers opcionales.

`AppLogo.vue` decide entre dos fuentes. Si el tenant subió un logo lo pinta tal cual con un `<img>`:
es su marca y no se toca. Si no, inyecta `logo.svg` en línea, que tiene la tinta en `currentColor`, y
el componente le pone el color: `variant="dark"` (auth) toma el `primary` del tema y `variant="light"`
(sidebar) se queda en blanco. Va en línea porque un `<img>` no hereda `currentColor`, y el id del
`mask` se hace único con `useId()` para que dos logos en la misma página no colisionen.

Lo único que queda en `src/core/components/` es `AppLogo.vue`, porque lee el logo del tenant desde el
store de configuración y por tanto es específico de la app.

`AppModal` topa la tarjeta a `90vh` y deja cabecera y pie fuera del scroll, para que Guardar y
Cancelar sigan a la vista en formularios largos. Acepta `loading` (spinner en Guardar) y
`contentLoading` (spinner en lugar del cuerpo mientras se cargan los datos).

Al editar, el formulario carga el elemento antes de mostrarse: `useXxxForm` expone `loadingItem` y la
vista lo pasa a `AppModal` en `:content-loading`. El modal enseña un spinner y bloquea Guardar hasta
que llegan los datos, así no se ve un formulario vacío ni se guarda a medias. Al crear no aplica.


---

## Notifications

```ts
import { notify } from '@/core/utils/common';

notify('success', t('groups.create.success'));
notify('error', `${t('groups.create.error')}: ${message}`);
```

---

## Before committing

```bash
pnpm typecheck   # vue-tsc --noEmit
pnpm lint        # eslint --fix
pnpm format      # prettier --write
```

---

## Related projects

- `saas-starter-api` — the Laravel API this SPA consumes
- `saas-starter-admin` — Filament panel that provisions tenants and owns the DB schema
