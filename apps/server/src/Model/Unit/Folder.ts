import { Entity } from './Entity';
import { IConfigFolder } from '@libs/types/IConfigTypes';
import { Unit } from './Unit';
import { IFolder } from '@libs/types/IBricksDocument';

export class Folder extends Unit {
    private enitityList: Entity[];
    private displayName: string;
    private children: Folder[] = [];

    public constructor(item: IConfigFolder, parent?: Entity) {
        super(item.key);

        this.displayName = item.display;
        this.enitityList = item.entities.map((e) => new Entity(e, this, parent));
    }

    public addChildren(newChild: Folder): void {
        this.children.push(newChild);
    }

    public getEnitityList(): Entity[] {
        return this.enitityList;
    }

    public getDisplayName(): string {
        return this.displayName;
    }

    public toJSON(): IFolder {
        return {
            key: this.getKey(),
            displayName: this.getDisplayName(),
            entities: this.enitityList.map((_) => _.toJSON()),
            children: this.children.map((_) => _.toJSON()),
        };
    }
}
