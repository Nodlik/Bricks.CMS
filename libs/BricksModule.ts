import { Bricks } from './Bricks';

export abstract class BricksModule {
    protected bricks: Bricks;
    protected name: string;

    public abstract init(): void;

    public constructor(name: string, bricks: Bricks) {
        this.name = name;
        this.bricks = bricks;
    }

    public getName(): string {
        return this.name;
    }

    public registerType(typeName: string, mongoType: string) {
        this.bricks.registerType(typeName, mongoType);
    }
}
