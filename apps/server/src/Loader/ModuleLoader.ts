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

    public parseModuleDirectory(): void {
        const modulesList: any = processing();

        for (const moduleName in modulesList) {
            const init = modulesList[moduleName];
            init(moduleName, this.bricks);
        }
    }
}
