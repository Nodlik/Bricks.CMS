/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Folder } from './Unit/Folder';
import { Entity } from './Unit/Entity';
import { Bricks } from '@libs/Bricks';
import mongoose from 'mongoose';

export type MongooseModel = mongoose.Model<mongoose.Document, Record<string, unknown>>;
export type MongooseModelMap = Map<string, MongooseModel>;

export class BricksSingleton {
    private static instance: BricksSingleton;

    private folders: Folder[] = [];
    private entities: Map<string, Entity> = new Map();
    private bricks!: Bricks;

    private models!: MongooseModelMap;

    private constructor() {
        //
    }

    public init(folders: Folder[], entities: Map<string, Entity>, bricks: Bricks): void {
        if (this.folders.length > 0) {
            throw new Error('Model already exists');
        }

        this.bricks = bricks;
        this.folders = folders;
        this.entities = entities;
    }

    public setModels(models: MongooseModelMap): void {
        this.models = models;
    }

    public getFolders(): Folder[] {
        return this.folders;
    }

    public getEntities(): Map<string, Entity> {
        return this.entities;
    }

    public getBricks(): Bricks {
        return this.bricks;
    }

    public hasModel(entityName: string): boolean {
        return this.models.has(entityName);
    }

    public getModel(entityName: string): MongooseModel {
        if (this.models.has(entityName)) {
            return this.models.get(entityName)!;
        }

        throw new Error(`Entity ${entityName} does not exist`);
    }

    public getEntity(key: string): Entity {
        const entity = this.entities.get(key);
        if (!entity) {
            throw new Error('An entity with such a key does not exist');
        }

        return entity;
    }

    public static getInstance(): BricksSingleton {
        if (!BricksSingleton.instance) {
            BricksSingleton.instance = new BricksSingleton();
        }

        return BricksSingleton.instance;
    }
}

const BricksData = BricksSingleton.getInstance();

export default BricksData;
