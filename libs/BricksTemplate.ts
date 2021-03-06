import { IBricksCollection, IEntity, IField } from './types/IBricksDocument';

import { ENTITY_TYPE } from './types/IConfigTypes';
import React from 'react';
import templates from '../modules/templates';

export type FieldValidateResult = {
    value: unknown;
    isValid: boolean;
};
export type ChangeValueEvent = (key: string, value: any, isValid?: boolean) => void;
// export type EntityChangeEvent = (values: Map<string, FieldValidateResult>) => void;
export type EntityChangeEvent = (
    values: Record<string, unknown> | undefined,
    isValid: boolean
) => void;

/**
 * SINGLE ENTITY (NEW, EDIT)
 */
export interface IRenderEntityProps {
    document: IEntity;
    templates: BricksTemplateSingleton;
    isNew: boolean;
    defaultValue?: Map<string, FieldValidateResult>;
    onChange?: EntityChangeEvent;
}
export type EntityFunctionComponent = (props: IRenderEntityProps) => React.ReactElement;

/**
 * ENTITY COLLECTION
 */
export interface IRenderCollectionProps {
    collection: IBricksCollection;
    templates: BricksTemplateSingleton;
}
export type EntityCollectionFunctionComponent = (
    props: IRenderCollectionProps
) => React.ReactElement;

/**
 * FIELD
 */
export interface IRenderFieldProps {
    field: IField;
    onChange?: ChangeValueEvent;
}
export type FieldFunctionComponent = (props: IRenderFieldProps) => React.ReactElement;

export interface ModuleExportTemplates {
    single?: EntityFunctionComponent;
    collection?: EntityCollectionFunctionComponent;
    fields?: [ENTITY_TYPE, string, FieldFunctionComponent][];
}

export class BricksTemplateSingleton {
    /** moduleName => react function component */
    private collectionTemplates: Map<string, EntityCollectionFunctionComponent> = new Map();

    /** moduleName => react function component */
    private singleTemplates: Map<string, EntityFunctionComponent> = new Map();

    /** moduleName_entityType_fieldType => react function component */
    private fieldTemplates: Map<string, FieldFunctionComponent> = new Map();

    private static instance: BricksTemplateSingleton;

    private constructor() {
        //
    }

    public static getInstance(): BricksTemplateSingleton {
        if (!BricksTemplateSingleton.instance) {
            BricksTemplateSingleton.instance = new BricksTemplateSingleton();
        }

        return BricksTemplateSingleton.instance;
    }

    public init(): void {
        const moduleTemplates: any = templates();

        for (const moduleName in moduleTemplates) {
            const currentTemplates: ModuleExportTemplates = moduleTemplates[moduleName];

            if (currentTemplates) {
                if (currentTemplates.single) {
                    this.singleTemplates.set(moduleName, currentTemplates.single);
                }

                if (currentTemplates.collection) {
                    this.collectionTemplates.set(moduleName, currentTemplates.collection);
                }

                if (currentTemplates.fields) {
                    for (const [enitityType, fieldType, component] of currentTemplates.fields) {
                        this.fieldTemplates.set(
                            `${moduleName}_${enitityType}_${fieldType}`,
                            component
                        );
                    }
                }
            }
        }
    }

    public getFieldTemplate(
        entityType: string,
        fieldType: string,
        moduleName = 'default'
    ): FieldFunctionComponent {
        const component =
            this.fieldTemplates.get(moduleName + '_' + entityType + '_' + fieldType) ||
            this.fieldTemplates.get('default_' + entityType + '_' + fieldType);

        if (!component) {
            throw new Error('Template to this type not found');
        }

        return component;
    }

    public get(fieldType: string, moduleName = 'default'): FieldFunctionComponent {
        return this.getFieldTemplate('collection', fieldType, moduleName);
    }

    public getSingleTemplate(moduleName = 'default'): EntityFunctionComponent {
        const template =
            this.singleTemplates.get(moduleName) || this.singleTemplates.get('default');

        if (!template) {
            throw new Error('Template not found. Init the default modules');
        }

        return template;
    }

    public getCollectionTemplate(moduleName = 'default'): EntityCollectionFunctionComponent {
        const template =
            this.collectionTemplates.get(moduleName) || this.collectionTemplates.get('default');

        if (!template) {
            throw new Error('Template not found. Init the default modules');
        }

        return template;
    }
}

const BricksTemplate = BricksTemplateSingleton.getInstance();
export default BricksTemplate;
