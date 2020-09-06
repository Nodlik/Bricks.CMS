import { promises as fsPromises } from 'fs';
import { IConfigFolder } from '@libs/types/IConfigTypes';
import BricksData from '../Model/BricksData';
import { Bricks } from '@libs/Bricks';
import { Folder } from '../Model/Unit/Folder';
import { Entity } from '../Model/Unit/Entity';

import mongoose from 'mongoose';

/**
 * Config file Loader
 */
export class ConfigLoader {
    private readonly folders: IConfigFolder[] = [];
    private readonly bricks: Bricks;

    public constructor(bricks: Bricks) {
        this.bricks = bricks;
    }

    public async parseConfigDirectory(): Promise<void> {
        const configFolder = './config';
        const dir = await fsPromises.readdir(configFolder);

        for (const el of dir) {
            if (el.substr(-9) === 'bricks.js') {
                this.folders.push(await import(`../../../../config/${el}`));
            }
        }
    }

    public init(): void {
        const entities: Map<string, Entity> = new Map();

        const addEntitiesToSet = (folder: Folder) => {
            for (const e of folder.getEnitityList()) {
                entities.set(e.getKey(), e);

                for (const f of e.getChildren()) {
                    addEntitiesToSet(f);
                }
            }
        };

        const folders = this.folders.map((f) => {
            const folder = new Folder(f);
            addEntitiesToSet(folder);

            return folder;
        });

        BricksData.init(folders, entities, this.bricks);
    }

    public createMongoModel(): void {
        const models = new Map<
            string,
            mongoose.Model<mongoose.Document, Record<string, unknown>>
        >();
        const entity = BricksData.getEntities();

        for (const [key, e] of entity.entries()) {
            const model = mongoose.model(key, e.getMongoSchema());

            models.set(key, model);
        }

        BricksData.setModels(models);
    }
}
