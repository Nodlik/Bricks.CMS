import { Field } from 'apps/server/src/Model/Unit/Field';

export type ValueMiddleware = (value: unknown, field: Field) => unknown;

export class Bricks {
    private fieldMongoType: Map<string, string> = new Map();
    private fieldValueMiddleware: Map<string, ValueMiddleware> = new Map();

    public registerType(typeName: string, mongoType: string): void {
        if (this.fieldMongoType.has(typeName)) {
            throw new Error(`A type with the specified name: "${typeName}" already exists`);
        }

        this.fieldMongoType.set(typeName, mongoType);
    }

    public getMongoType(typeName: string): string {
        if (!this.fieldMongoType.has(typeName)) {
            throw new Error(`A type with the specified name: "${typeName}" not found`);
        }

        return this.fieldMongoType.get(typeName)!;
    }

    public registerValueMiddleware(typeName: string, middleware: ValueMiddleware): void {
        this.fieldValueMiddleware.set(typeName, middleware);
    }

    public async getFieldValue(value: unknown, field: Field): Promise<unknown> {
        if (this.fieldValueMiddleware.has(field.getType())) {
            const middleware = this.fieldValueMiddleware.get(field.getType())!;

            return await middleware(value, field);
        }

        return value;
    }
}
