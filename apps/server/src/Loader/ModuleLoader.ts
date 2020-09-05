import { promises as fsPromises } from 'fs';
import { BricksModule } from '@libs/BricksModule';
import { Bricks } from '@libs/Bricks';

/**
 * Module Loader
 */
export class ModuleLoader {
    private bricks: Bricks;

    public constructor(bricks: Bricks) {
        this.bricks = bricks;
    }

    public async parseModuleDirectory(): Promise<void> {
        const dir = await fsPromises.readdir('./modules');

        for (const moduleFolder of dir) {
            const stat = await fsPromises.lstat(`./modules/${moduleFolder}`);
            if (stat.isDirectory()) {
                const { default: module } = await import(`@modules/${moduleFolder}/server`);

                module.init(moduleFolder, this.bricks);
            }
        }
    }
}
