import { promises as fsPromises } from 'fs';
import { Bricks } from '@libs/Bricks';
import processing from '@modules/processing';

/**
 * Module Loader
 */
export class ModuleLoader {
    private bricks: Bricks;

    public constructor(bricks: Bricks) {
        this.bricks = bricks;
    }

    public async parseModuleDirectory(): Promise<void> {
        const modulesList: any = processing();

        for (const moduleName in modulesList) {
            const init = modulesList[moduleName];
            init(moduleName, this.bricks);
        }
    }
}
