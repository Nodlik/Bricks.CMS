import { ENTITY_TYPE, EntityEffects, FieldValidators } from './IConfigTypes';

export interface IField {
    key: string;
    type: string;
    displayName: string;
    description: string;
    view: string[];
    readonly: boolean;
    template: string;
    required: boolean;
    value: any;
    options: any;
    validators: FieldValidators;
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
