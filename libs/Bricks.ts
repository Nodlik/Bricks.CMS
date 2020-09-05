import { type } from 'os';
import { Field } from 'apps/server/src/Model/Unit/Field';

export type ValueMiddleware = (value: any, field: Field) => any;

export class Bricks {
    private fieldMongoType: Map<string, string> = new Map();
    private fieldValueMiddleware: Map<string, ValueMiddleware> = new Map();

    public registerType(typeName: string, mongoType: string) {
        if (this.fieldMongoType.has(typeName))
            throw new Error(`A type with the specified name: "${typeName}" already exists`);

        this.fieldMongoType.set(typeName, mongoType);
    }

    public getMongoType(typeName: string): string {
        if (!this.fieldMongoType.has(typeName))
            throw new Error(`A type with the specified name: "${typeName}" not found`);

        return this.fieldMongoType.get(typeName)!;
    }

    public registerValueMiddleware(typeName: string, middleware: ValueMiddleware) {
        this.fieldValueMiddleware.set(typeName, middleware);
    }

    public async getFieldValue(value: any, field: Field): Promise<any> {
        if (this.fieldValueMiddleware.has(field.getType())) {
            const middleware = this.fieldValueMiddleware.get(field.getType())!;
            
            return await middleware(value, field);
        }

        return value;
    }
}
