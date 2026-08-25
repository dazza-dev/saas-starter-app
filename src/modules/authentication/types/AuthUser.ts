export interface AuthUserRole {
    uuid: string;
    name: string;
    slug: string;
}

export interface AuthUser {
    uuid: string;
    name: string;
    email: string | null;
    username: string | null;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    avatar: string | null;
    roles: AuthUserRole[];
    isAdmin: boolean;
    permissions: string[];
}

// Effective permissions of the authenticated user (v1/permissions/me).
export interface MyPermissions {
    permissions: string[];
    isAdmin: boolean;
}

export interface ProfileForm {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    username: string;
    password: string;
    passwordConfirmation: string;
}

// Profile PUT body: empty fields go as null, password only if it changes.
export interface ProfileUpdatePayload {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    phone: string | null;
    username: string | null;
    password?: string;
    passwordConfirmation?: string;
}

// Reset body: token and email arrive as query params from the email link.
export interface ResetPasswordPayload {
    token: string;
    email: string;
    password: string;
    passwordConfirmation: string;
}
