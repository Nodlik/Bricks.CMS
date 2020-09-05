export abstract class Unit {
    protected key: string;

    protected constructor(key: string) {
        this.key = key;
    }

    public getKey(): string {
        return this.key;
    }
}