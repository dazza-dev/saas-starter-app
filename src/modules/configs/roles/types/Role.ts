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

// A single permission (one cell in the matrix).
export interface Permission {
    uuid: string;
    name: string;
    label: string;
}

// A permission group: each row in the matrix.
export interface PermissionGroup {
    group: string;
    label: string;
    permissions: Permission[];
}

// A module with its groups: each tab in the matrix; `module` is null if it belongs to none.
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
