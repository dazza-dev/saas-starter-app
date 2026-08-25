import type { LoadDataParams } from '@dazzadev/vuetify-datatable';

export interface UserRole {
    uuid: string;
    name: string;
    slug: string;
}

export interface User {
    uuid: string;
    firstName: string;
    lastName: string | null;
    fullName: string;
    email: string;
    phone: string | null;
    username: string;
    avatar: string | null;
    status: 'active' | 'inactive';
    roles: UserRole[];
    lastLoginAt: string | null;
    createdAt: string;
    deletedAt?: string | null;
}

export interface UserForm {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    username: string;
    // Empty on edit means "don't change the password".
    password: string;
    status: 'active' | 'inactive';
    roleUuids: string[];
}

export interface UserFilters {
    status?: string | null;
    roles?: string[];
}

export type UserTableParams = LoadDataParams & { filters?: UserFilters };
