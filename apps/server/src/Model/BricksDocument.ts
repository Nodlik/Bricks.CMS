import { IBricksDocument, IField } from '@libs/types/IBricksDocument';

import { Entity } from './Unit/Entity';
import { ServerError } from '@libs/types/APIError';
import mongoose from 'mongoose';

export class BricksDocument {
    private document: mongoose.Document;
    private readonly entity: Entity;
    private readonly id: string;
    private readonly fields: IField[];
    private readonly mongoDocument: mongoose.Document;

    public constructor(entity: Entity, document: mongoose.Document) {
        this.entity = entity;
        this.document = document;
        this.id = this.document._id;

        this.fields = [];
        this.mongoDocument = document;
        this.fillFields();
    }

    private fillFields() {
        for (const field of this.entity.getField()) {
            const value = !(field.getKey() in this.document)
                ? null
                : this.document.get(field.getKey());

            this.fields.push({
                key: field.getKey(),
                type: field.getType(),
                displayName: field.getDisplayName(),
                description: field.getDescription(),
                view: field.getView(),
                required: field.required(),
                readonly: field.readonly(),
                template: field.getTemplate(),
                options: field.getOptions(),
                value: value,
                validators: field.serializeValidators(),
                mongoType: field.getMongoType(),
            });
        }
    }

    public getEntity(): Entity {
        return this.entity;
    }

    public getField(fieldKey: string): IField {
        for (const field of this.fields) {
            if (fieldKey === field.key) {
                return field;
            }
        }

        throw new ServerError(0);
    }

    public getValue<T>(fieldKey: string): T {
        return this.getField(fieldKey).value as T;
    }

    public getPosition(): number {
        if (!this.entity.getEffects().sortable) {
            throw new ServerError(0);
        }

        return this.mongoDocument.get(this.entity.getEffects().sortable!) as number;
    }

    public getFields(): IField[] {
        return this.fields;
    }

    public getId(): string {
        return this.id;
    }

    public toJSON(): IBricksDocument {
        return {
            id: this.id,
            fields: this.fields,
            key: this.entity.getKey(),
            type: this.entity.getType(),
            template: this.entity.getTemplate(),
            displayName: this.entity.getDisplayName(),
            description: this.entity.getDescription(),
            apiAction: this.entity.getApiAction(),
            titleField: this.entity.getTitleField(),
            effects: this.entity.getEffects(),
        };
    }
}
