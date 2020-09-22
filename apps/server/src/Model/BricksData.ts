import { Bricks } from '@libs/Bricks';
import { ERROR_CODE } from '@libs/Error';
import { Entity } from './Unit/Entity';
import { Folder } from './Unit/Folder';
import { ServerError } from '@libs/types/APIError';
import { User } from './Unit/Essential/User';
import { UserRepository } from './Repository/UserRepository';
import crypto from 'crypto';
import mongoose from 'mongoose';

export type MongooseModel = mongoose.Model<mongoose.Document, Record<string, unknown>>;
export type MongooseModelMap = Map<string, MongooseModel>;

export class BricksSingleton {
    private static instance: BricksSingleton;

    private folders: Folder[] = [];
    private entities: Map<string, Entity> = new Map();
    private bricks!: Bricks;
    private userModel: MongooseModel;

    private models!: MongooseModelMap;

    private jwtKey: string;

    private constructor() {
        //
    }

    private createUserModel(): void {
        if (this.userModel) {
            throw new Error('User services already init');
        }

        this.userModel = mongoose.model('User', User.getMongoSchema());
    }

    public init(folders: Folder[], entities: Map<string, Entity>, bricks: Bricks): void {
        if (this.folders.length > 0) {
            throw new Error('Model already exists');
        }

        this.bricks = bricks;
        this.folders = folders;
        this.entities = entities;
    }

    public async initAuthService(): Promise<void> {
        this.createUserModel();

        const users = await UserRepository.GetAll();
        if (users.length === 0) {
            await UserRepository.CreateDefault();
        }
    }

    public getJWTSecret(): string {
        return this.jwtKey;
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

    public getUserModel(): MongooseModel {
        return this.userModel;
    }

    public hasModel(entityName: string): boolean {
        return this.models.has(entityName);
    }

    public getModel(entityName: string): MongooseModel {
        if (this.models.has(entityName)) {
            return this.models.get(entityName)!;
        }

        throw new ServerError(ERROR_CODE.ENTITY_NOT_EXIST);
    }

    public getGlobalSalt(): string {
        return process.env.GLOBAL_SALT || '';
    }

    public updateJWTSecret(): void {
        this.jwtKey = process.env.KEY || crypto.randomBytes(50).toString('hex');
    }

    public getEntity(key: string): Entity {
        const entity = this.entities.get(key);
        if (!entity) {
            throw new ServerError(ERROR_CODE.ENTITY_NOT_EXIST);
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
