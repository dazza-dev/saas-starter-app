import type { LoadDataParams } from '@dazzadev/vuetify-datatable';

export interface Role {
    uuid: string;
    name: string;
    displayName: string;
    description: string | null;
    deletedAt?: string | null;
}

export interface RoleForm {
    displayName: string;
    description: string | null;
}

// Un permiso concreto (una casilla de la matriz).
export interface Permission {
    uuid: string;
    name: string;
    label: string;
}

// Un grupo de permisos: cada fila de la matriz.
export interface PermissionGroup {
    group: string;
    label: string;
    permissions: Permission[];
}

// Un módulo con sus grupos: cada pestaña de la matriz; `module` es null si no cuelga de ninguno.
export interface PermissionModule {
    module: string | null;
    label: string;
    icon: string | null;
    groups: PermissionGroup[];
}

export interface RolePermissionsResponse {
    data: PermissionModule[];
    assigned: string[];
}

export type RoleTableParams = LoadDataParams;
