import { ENTITY_TYPE, EntityEffects, VIEW_TYPE } from './IConfigTypes';

export interface IJSONCustomValidator {
    validatorFn: string;
    messageFn: string;
}

export interface IJSONFieldValidators {
    min?: unknown;
    max?: unknown;
    lowercase?: unknown;
    uppercase?: unknown;
    trim?: unknown;
    match?: unknown;
    enum?: unknown;
    minlength?: unknown;
    maxlength?: unknown;
    custom?: IJSONCustomValidator[];
}

export interface IField {
    key: string;
    type: string;
    displayName: string;
    description: string;
    view: VIEW_TYPE[];
    readonly: boolean;
    template: string;
    required: boolean;
    value: any;
    options: any;
    validators: IJSONFieldValidators;
    mongoType: string;
}

export interface IEntity {
    key: string;
    type: ENTITY_TYPE;
    displayName: string;
    template: string;
    description: string;
    fields: IField[];
    apiAction: string[];
    titleField: string;
    effects: EntityEffects;
}

export interface IBricksCollection {
    entity: IEntity;
    documents: IBricksDocument[];
}

export interface IBricksDocument extends IEntity {
    id: string;
    fields: IField[];
}

export interface IFolder {
    key: string;
    displayName: string;
    entities: IEntity[];
    children: IFolder[];
}
