import BricksData from "../BricksData";
import { Folder } from "../Unit/Folder";

export class FolderRepository {
    public static GetAll(): Folder[] {
        return BricksData.getFolders();
    }
}
