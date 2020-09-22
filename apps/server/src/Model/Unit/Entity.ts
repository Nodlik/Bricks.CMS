import { API_ACTION, ENTITY_TYPE, EntityEffects, IConfigEntity } from '@libs/types/IConfigTypes';
import { Schema, SchemaDefinition } from 'mongoose';

import { Field } from './Field';
import { Folder } from './Folder';
import { IEntity } from '@libs/types/IBricksDocument';
import { Unit } from './Unit';

// eslint-disable-next-line @typescript-eslint/no-var-requires

export class Entity extends Unit {
    protected readonly displayName: string;
    protected readonly description: string;
    protected readonly children: Folder[] = [];
    protected readonly fields: Field[] = [];
    protected readonly type: ENTITY_TYPE;
    protected readonly template: string;
    protected readonly titleField: string;
    protected readonly apiAction: string[];
    protected readonly folder: Folder;
    protected readonly effects: EntityEffects;

    protected readonly parent?: Entity;

    private mongodbSchema: Schema;

    public constructor(item: IConfigEntity, folder: Folder, parent?: Entity) {
        super(item.key);

        this.displayName = item.display.name;
        this.description = item.display.description || '';
        this.type = item.type;
        this.parent = parent;
        this.folder = folder;
        this.template = item.template || 'default';

        this.apiAction = item.apiAction === undefined ? ['fetch'] : item.apiAction;
        this.effects = item.effect || {};

        for (const field of item.fields) {
            this.fields.push(new Field(field, this.template, this.key));
        }

        if (Array.isArray(item.children)) {
            this.children = item.children.map((_) => {
                const folder = new Folder(_, this);
                this.folder.addChildren(folder);

                return folder;
            });
        }

        if (!item.display.titleField) {
            this.titleField = 'id';

            if (this.hasField('title')) {
                this.titleField = 'title';
            } else if (this.hasField('name')) {
                this.titleField = 'name';
            }
        } else {
            this.titleField = item.display.titleField;
        }
    }

    public getMongoSchema(): Schema {
        if (!this.mongodbSchema) {
            this.mongodbSchema = this.createMongoSchema();
        }

        return this.mongodbSchema;
    }

    public getApiAction(): string[] {
        return this.apiAction;
    }

    public getTemplate(): string {
        return this.template;
    }

    public getType(): ENTITY_TYPE {
        return this.type;
    }

    public getDisplayName(): string {
        return this.displayName;
    }

    public getDescription(): string {
        return this.description;
    }

    public getTitleField(): string {
        return this.titleField;
    }

    public getChildren(): Folder[] {
        return this.children;
    }

    public getField(): Field[] {
        return this.fields;
    }

    public getFieldByKey(key: string): Field | undefined {
        return this.fields.find((_) => _.getKey() === key);
    }

    public hasField(key: string): boolean {
        return this.fields.findIndex((_) => _.getKey() === key) !== -1;
    }

    public getEffects(): EntityEffects {
        return this.effects;
    }

    public hasApiAction(action: API_ACTION): boolean {
        return this.apiAction.includes(action);
    }

    public getParent(): Entity | undefined {
        return this.parent;
    }

    public toJSON(): IEntity {
        return {
            key: this.key,
            type: this.type,
            displayName: this.displayName,
            template: this.template,
            description: this.description,
            fields: this.fields.map((_) => _.toJSON()),
            apiAction: this.apiAction,
            titleField: this.titleField,
            effects: this.effects,
        };
    }

    private createMongoSchema(): Schema {
        const filedsDescription: SchemaDefinition = {};

        for (const field of this.fields) {
            const schema: any = {
                type: field.getMongoType(),
                required: field.required(),
            };

            for (const [name, validator] of Object.entries(field.getValidators())) {
                if (name !== 'custom') {
                    schema[name] = validator;
                } else {
                    schema['validate'] = validator;
                }
            }

            filedsDescription[field.getKey()] = schema;
        }

        if (this.parent) {
            filedsDescription[this.parent.getKey()] = {
                type: Schema.Types.ObjectId,
                ref: this.parent.getKey(),
                required: true,
            };
        }

        if (this.effects.sortable) {
            filedsDescription[this.effects.sortable] = {
                type: 'Number',
                required: true,
            };
        }

        return new Schema(filedsDescription);
    }
}
