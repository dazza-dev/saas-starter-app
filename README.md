# saas-starter-app

SPA multi-tenant del starter kit. Consume `saas-starter-api` y se sirve bajo `/{tenant}/`.

Vue 3.5 · Vuetify 4 · TypeScript 6 · Vite 8 · Pinia · Vue i18n · CASL

---

## Qué trae

- Login, recuperación de contraseña, auto-login y perfil de usuario
- Pantalla de entrada que pregunta el tenant cuando la URL no lo trae
- Multitenancy resuelto desde la URL (`/{tenant}/`) y enviado en la cabecera `X-Tenant`
- Permisos con CASL en tres capas: guard del router, directiva `v-can` y filtrado del sidebar
- CRUD completo de usuarios, roles (con matriz de permisos), grupos y ajustes
- Temas claro/oscuro con selector y ocho paletas, i18n en `en`/`es`/`pt`. El sidebar usa el token
  `sidebarBg`, que sigue al primario salvo que el tema lo sobreescriba, como hace `EMERALD_THEME`
  (sidebar negro, botones verdes). El tema activo sale del ajuste `app_theme` de cada tenant
- Componentes de formulario con validación Vuelidate integrada

## Requisitos

- Node.js 18+
- pnpm

## Puesta en marcha

```bash
pnpm install
cp .env.example .env
pnpm dev
```

`vuetify-app-kit` se descarga de GitHub como una dependencia más
(`github:dazza-dev/vuetify-app-kit`); no hay que clonarlo ni construirlo.

Abre `http://localhost:5173/`: sin tenant en la URL la app pide el nombre de la cuenta y redirige a
su login. Si ya lo sabes, entra directo a `http://localhost:5173/{tenant}/`, donde `{tenant}` es el
dominio de un tenant creado en `saas-starter-admin` (p. ej. `http://localhost:5173/acme/`).

## Comandos

```bash
pnpm dev         # servidor de desarrollo
pnpm build       # build de producción
pnpm typecheck   # vue-tsc --noEmit
pnpm lint        # eslint --fix
pnpm format      # prettier --write
```

## Estructura

```
src/
├── core/
│   ├── components/   AppLogo (el resto los sirve vuetify-app-kit)
│   ├── composables/  useOptions (listas de referencia compartidas)
│   ├── directives/   v-can
│   ├── plugins/      ability (CASL)
│   ├── sidebar/      sidebarApp.ts + useSidebarItems.ts
│   ├── stores/       config (ajustes del tenant)
│   └── utils/        axios preconfigurado, notify, download, tenantStorage
├── locales/          common.json y sidebar.json por idioma + messages.ts
├── modules/
│   ├── authentication/  login, selección de tenant, recuperación de contraseña, auto-login
│   ├── dashboard/       pantalla de inicio
│   ├── users/           CRUD de usuarios  ← ejemplo completo
│   └── configs/
│       ├── groups/      ← el ejemplo más pequeño del patrón; cópialo para módulos nuevos
│       ├── roles/       roles + matriz de permisos
│       └── settings/    ajustes del tenant
└── routes/           AppRoutes, ConfigsRoutes, AuthRoutes, ProfileRoutes, router
```

## Almacenamiento local

La app se sirve desde un solo origen con el tenant en la ruta, y `localStorage` se aísla por origen,
nunca por ruta: sin prefijo, todos los tenants compartirían las mismas claves. Usa siempre los
ayudantes de `src/core/utils/tenantStorage.ts`, que anteponen el tenant a la clave.

Las reglas de desarrollo, el patrón de módulo y las convenciones están en [`CLAUDE.md`](./CLAUDE.md).

## Añadir un módulo

1. Copia `src/modules/configs/groups/` y renombra todo
2. Registra sus rutas en `src/routes/AppRoutes.ts` (o `ConfigsRoutes.ts`)
3. Registra sus locales en `src/locales/messages.ts`, en los **tres** idiomas
4. Añade su entrada al sidebar en `src/core/sidebar/sidebarApp.ts` con su `permission`
5. Crea el módulo equivalente en `saas-starter-api` y sus permisos en `saas-starter-admin`

## Proyectos relacionados

| Repo                 | Qué es                                         |
| -------------------- | ---------------------------------------------- |
| `saas-starter-api`   | La API que consume esta SPA                    |
| `saas-starter-admin` | Panel de tenants y dueño del esquema           |
| `vuetify-app-kit`    | Layouts, tema, componentes y utilidades de app |
