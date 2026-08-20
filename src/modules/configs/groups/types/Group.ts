import type { LoadDataParams } from '@dazzadev/vuetify-datatable';

export interface Group {
    uuid: string;
    name: string;
    deletedAt?: string | null;
}

export interface GroupForm {
    name: string;
}

export type GroupTableParams = LoadDataParams;
