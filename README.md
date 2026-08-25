# saas-starter-app

Multi-tenant SPA from the starter kit. Consumes `saas-starter-api` and is served under `/{tenant}/`.

Vue 3.5 · Vuetify 4 · TypeScript 6 · Vite 8 · Pinia · Vue i18n · CASL

![SaaS starter app](https://github.com/user-attachments/assets/6cb7947b-ea18-4948-80af-d5ff9f0477ef)

---

## What it includes

- Login, password recovery, auto-login and user profile
- Entry screen that asks for the tenant when the URL doesn't include one
- Multitenancy resolved from the URL (`/{tenant}/`) and sent in the `X-Tenant` header
- CASL permissions in three layers: router guard, `v-can` directive and sidebar filtering
- Full CRUD for users, roles (with permission matrix), groups and settings
- Light/dark themes with a selector and eight palettes, i18n in `en`/`es`/`pt`. The sidebar uses the
  `sidebarBg` token, which follows the primary color unless the theme overrides it, as `EMERALD_THEME`
  does (black sidebar, green buttons). The active theme comes from each tenant's `app_theme` setting
- Form components with built-in Vuelidate validation

## Requirements

- Node.js 18+
- pnpm

## Getting started

```bash
pnpm install
cp .env.example .env
pnpm dev
```

`vuetify-app-kit` is pulled from GitHub as a regular dependency
(`github:dazza-dev/vuetify-app-kit`); there's no need to clone or build it separately.

Open `http://localhost:5173/`: without a tenant in the URL, the app asks for the account name and
redirects to its login. If you already know it, go straight to `http://localhost:5173/{tenant}/`,
where `{tenant}` is the domain of a tenant created in `saas-starter-admin` (e.g. `http://localhost:5173/acme/`).

## Commands

```bash
pnpm dev         # development server
pnpm build       # production build
pnpm typecheck   # vue-tsc --noEmit
pnpm lint        # eslint --fix
pnpm format      # prettier --write
```

## Structure

```
src/
├── core/
│   ├── components/   AppLogo (the rest are served by vuetify-app-kit)
│   ├── composables/  useOptions (shared reference lists)
│   ├── directives/   v-can
│   ├── plugins/      ability (CASL)
│   ├── sidebar/      sidebarApp.ts + useSidebarItems.ts
│   ├── stores/       config (tenant settings)
│   ├── types/        shared types (common.type, widgets.type)
│   ├── utils/        preconfigured axios, notify, download, tenantStorage
│   ├── views/        ForbiddenView
│   └── widgets/      header widgets: modules, navigation, notifications, profile
├── locales/          common.json and sidebar.json per language + messages.ts
├── modules/
│   ├── authentication/  login, tenant selection, password recovery, auto-login
│   ├── dashboard/       home screen
│   ├── users/           user CRUD  ← full example
│   └── configs/
│       ├── groups/      ← the smallest example of the pattern; copy it for new modules
│       ├── roles/       roles + permission matrix
│       └── settings/    tenant settings
└── routes/           AppRoutes, ConfigsRoutes, AuthRoutes, ProfileRoutes, router
```

## Local storage

The app is served from a single origin with the tenant in the path, and `localStorage` is isolated
by origin, never by route: without a prefix, all tenants would share the same keys. Always use the
helpers in `src/core/utils/tenantStorage.ts`, which prefix the key with the tenant.

Development rules, the module pattern and conventions live in [`CLAUDE.md`](./CLAUDE.md).

## Customization

Every layout default lives in one place, the `setCustomizerDefaults()` call in `src/main.ts`:

| Option        | Values           | What it does                                                                 |
| ------------- | ---------------- | ---------------------------------------------------------------------------- |
| `activeTheme` | a palette name   | Colour palette. The backend's `app_theme` setting overrides it at runtime    |
| `darkMode`    | `true` / `false` | Mode on first load; the header toggle then remembers the user's choice       |
| `miniSidebar` | `true` / `false` | Sidebar collapsed on first load; the toggle then remembers the user's choice |
| `boxed`       | `true` / `false` | `true` centres the content and caps it at 1200px, `false` fills the width    |
| `borderCard`  | `true` / `false` | `true` outlines cards with a border, `false` gives them a shadow             |

Palettes: `DEFAULT_THEME`, `BLUE_THEME`, `AQUA_THEME`, `ORANGE_THEME`, `PURPLE_THEME`, `GREEN_THEME`,
`CYAN_THEME`, `EMERALD_THEME`. Each ships a `DARK_` twin, picked automatically by the mode toggle.
Their colours, the boxed width and the sidebar dimensions all live in `vuetify-app-kit`.

`darkMode` and `miniSidebar` are only the **starting** values: once the user touches the header
toggle or the sidebar button, their choice is kept in `localStorage` and wins from then on.

`vue-starter-kit` exposes the same options in the same call; `react-starter-kit` does so in
`src/core/context/config.ts`.

## Adding a module

1. Copy `src/modules/configs/groups/` and rename everything
2. Register its routes in `src/routes/AppRoutes.ts` (or `ConfigsRoutes.ts`)
3. Register its locales in `src/locales/messages.ts`, in **all three** languages
4. Add its entry to the sidebar in `src/core/sidebar/sidebarApp.ts` with its `permission`
5. Create the matching module in `saas-starter-api` and its permissions in `saas-starter-admin`

## Related projects

| Repo                 | What it is                                   |
| -------------------- | -------------------------------------------- |
| `saas-starter-api`   | The API this SPA consumes                    |
| `saas-starter-admin` | Tenant panel and schema owner                |
| `vuetify-app-kit`    | Layouts, theme, components and app utilities |
