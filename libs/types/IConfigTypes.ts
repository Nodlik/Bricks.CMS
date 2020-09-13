import { BricksSingleton } from 'apps/server/src/Model/BricksData';
import mongoose from 'mongoose';

export const enum ENTITY_TYPE {
    SINGLE = 'single',
    COLLECTION = 'collection',
}

export const enum VIEW_TYPE {
    NEW = 'new',
    EDIT = 'edit',
    LIST = 'list',
}

export const enum API_ACTION {
    CREATE = 'create',
    FETCH = 'fetch',
    UPDATE = 'update',
    DELETE = 'delete',
}

export type FieldAction = (row: mongoose.Document, bricks: BricksSingleton) => any;

export interface EntityEffects {
    sortable?: string;
}

export interface FieldEvents {
    beforeSave?: FieldAction;
}

export interface IFieldValidators {
    min?: unknown;
    max?: unknown;
    lowercase?: unknown;
    uppercase?: unknown;
    trim?: unknown;
    match?: unknown;
    enum?: unknown;
    minlength?: unknown;
    maxlength?: unknown;
    custom?: any[];
}

export interface IConfigField {
    key: string;
    type: string;
    template?: string;
    display: {
        name: string;
        description?: string;
        view?: VIEW_TYPE[];
    };
    readonly?: boolean;
    required?: boolean;
    events?: FieldEvents;
    validators?: IFieldValidators;
    options?: Record<string, unknown>;
}

export interface IConfigEntity {
    key: string;
    type: ENTITY_TYPE;
    template?: string;
    display: {
        name: string;
        description?: string;
        titleField?: string;
    };
    fields: IConfigField[];
    children?: IConfigFolder[];
    apiAction?: string[]; // [create, update, fetch] , default "fetch"
    effect?: EntityEffects;
}

export interface IConfigFolder {
    key: string;
    display: string;
    entities: IConfigEntity[];
}
