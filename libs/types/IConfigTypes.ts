import { BricksSingleton } from 'apps/server/src/Model/BricksData';
import mongoose from 'mongoose';

export const enum ENTITY_TYPE {
    SINGLE = 'single',
    COLLECTION = 'collection',
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

export interface FieldValidators {
    min?: any;
    max?: any;
    lowercase?: any;
    uppercase?: any;
    trim?: any;
    match?: any;
    enum?: any;
    minlength?: any;
    maxlength?: any;
    custom?: any[];
}

export interface IConfigField {
    key: string;
    type: string;
    template?: string;
    display: {
        name: string;
        description?: string;
        view?: string[]; // [collection?, single?]
    };
    readonly?: boolean;
    required?: boolean;
    events?: FieldEvents;
    validators?: FieldValidators;
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
