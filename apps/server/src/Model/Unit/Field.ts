import { Unit } from './Unit';
import { IConfigField, FieldEvents, FieldValidators } from '@libs/types/IConfigTypes';
import BricksData from '../BricksData';
import { IField } from '@libs/types/IBricksDocument';

export class Field extends Unit {
    private readonly displayName: string;
    private readonly description: string;
    private readonly isRequired: boolean;
    private readonly isReadonly: boolean;
    private readonly template: string;

    private readonly type: string;
    private readonly view: string[];
    private readonly events: FieldEvents;
    private readonly validators: FieldValidators;

    private readonly options: Record<string, unknown>;

    public constructor(item: IConfigField, template: string, entityKey: string) {
        super(item.key || entityKey);

        this.displayName = item.display.name;
        this.description = item.display.description || '';
        this.isRequired = item.required || false;
        this.isReadonly = item.readonly || false;
        this.view = item.display.view || ['single', 'collection'];
        this.template = item.template || template;
        this.events = item.events || {};
        this.validators = item.validators || {};
        this.options = item.options || {};

        this.type = item.type;
    }

    public getTemplate(): string {
        return this.template;
    }

    public getView(): string[] {
        return this.view;
    }

    public getType(): string {
        return this.type;
    }

    public getMongoType(): string {
        return BricksData.getBricks().getMongoType(this.type);
    }

    public getDisplayName(): string {
        return this.displayName;
    }

    public getDescription(): string {
        return this.description;
    }

    public required(): boolean {
        return this.isRequired;
    }

    public readonly(): boolean {
        return this.isReadonly;
    }

    public getEvents(): FieldEvents {
        return this.events;
    }

    public getValidators(): FieldValidators {
        return this.validators;
    }

    public getOptions(): Record<string, unknown> {
        return this.options;
    }

    public toJSON(): IField {
        return {
            key: this.getKey(),
            type: this.getType(),
            displayName: this.getDisplayName(),
            description: this.getDescription(),
            view: this.getView(),
            readonly: this.readonly(),
            template: this.getTemplate(),
            required: this.required(),
            options: this.getOptions(),
            value: null,
        };
    }
}
