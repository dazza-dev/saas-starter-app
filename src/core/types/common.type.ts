import type { RouteLocationNormalized } from 'vue-router';
import type { MenuItem } from 'vuetify-app-kit';

export interface NamedOption {
    uuid: string;
    name: string;
}

// `slug` es el nombre técnico del rol, el que aparece en sus permisos derivados.
export interface RoleOption extends NamedOption {
    slug: string;
}

export type HeaderTitleType = {
    title: string;
    subtitle?: string;
};

export type FilterType = {
    title: string;
    value: string | boolean | number;
};

export type ListType = {
    type: string;
    title: string;
    value: string | boolean | number;
    codeParent: string | null;
    typeParent: string | null;
};

// Permiso que exige una ruta: un nombre fijo o una función que lo deriva de los params.
export type RoutePermission = string | ((to: RouteLocationNormalized) => string | undefined);

// MenuItem del tema más el permiso que hace falta para verlo.
export type SidebarItem = MenuItem & {
    permission?: string;
    children?: SidebarItem[];
};
