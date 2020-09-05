import modules from '../modules/modules.json';
import { IBricksCollection, IField, IEntity } from './types/IBricksDocument';

export type ChangeValueEvent = (key: string, value: any) => void;
export type EntityChangeEvent = (values: Map<string, any>) => void;

/**
 * SINGLE ENTITY (NEW, EDIT)
 */
export interface IRenderEntityProps {
    document: IEntity;
    templates: BricksTemplateSingleton;
    onChange?: EntityChangeEvent
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
    fields?: Map<string, FieldFunctionComponent>;
}

export class BricksTemplateSingleton {
    /** moduleName => react function component */
    private collectionTemplates: Map<string, EntityCollectionFunctionComponent> = new Map<
        string,
        EntityCollectionFunctionComponent
    >();

    /** moduleName => react function component */
    private singleTemplates: Map<string, EntityFunctionComponent> = new Map<
        string,
        EntityFunctionComponent
    >();

    /** moduleName_entityType_fieldType => react function component */
    private fieldTemplates: Map<string, FieldFunctionComponent> = new Map<
        string,
        FieldFunctionComponent
    >();

    private static instance: BricksTemplateSingleton;

    private constructor() {}

    public static getInstance(): BricksTemplateSingleton {
        if (!BricksTemplateSingleton.instance) {
            BricksTemplateSingleton.instance = new BricksTemplateSingleton();
        }

        return BricksTemplateSingleton.instance;
    }

    public async init() {
        const m: any = modules;
        const loadedPromises = [];

        for (const el in m) {
            loadedPromises.push(import(`../modules/${m[el]}`));
        }

        const resultLoad = await Promise.all(loadedPromises);
        resultLoad.map((el) => {
            const module = el.default;

            if ('templates' in module) {
                const tempaltes: ModuleExportTemplates = module.templates();

                if (tempaltes.single)
                    this.singleTemplates.set(module.MODULE_NAME, tempaltes.single);

                if (tempaltes.collection)
                    this.collectionTemplates.set(module.MODULE_NAME, tempaltes.collection);

                if (tempaltes.fields) {
                    for (const [name, f] of tempaltes.fields.entries()) {
                        this.fieldTemplates.set(`${module.MODULE_NAME}_${name}`, f);
                    }
                }
            }
        });
    }

    public getFieldTemplate(
        entityType: string,
        fieldType: string,
        moduleName: string = 'default'
    ): FieldFunctionComponent {
        const component =
            this.fieldTemplates.get(moduleName + '_' + entityType + '_' + fieldType) ||
            this.fieldTemplates.get('default_' + entityType + '_' + fieldType);

        if (!component) {
            throw new Error('Template to this type not found');
        }

        return component;
    }

    public get(fieldType: string, moduleName: string = 'default') {
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
