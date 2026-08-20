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

// Permisos efectivos del usuario autenticado (v1/permissions/me).
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

// Cuerpo del PUT de perfil: los campos vacíos van como null y password solo si cambia.
export interface ProfileUpdatePayload {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    phone: string | null;
    username: string | null;
    password?: string;
    passwordConfirmation?: string;
}

// Cuerpo del reseteo: el token y el correo llegan como query params del enlace del correo.
export interface ResetPasswordPayload {
    token: string;
    email: string;
    password: string;
    passwordConfirmation: string;
}
