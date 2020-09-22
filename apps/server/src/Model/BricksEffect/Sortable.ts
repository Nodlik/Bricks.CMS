import BricksData from '../BricksData';
import { ERROR_CODE } from '@libs/Error';
import { ServerError } from '@libs/types/APIError';

export class SortableEffect {
    public static async MoveAndShift(
        entityKey: string,
        movedRowId: string,
        targerRowId: string
    ): Promise<void> {
        const entity = BricksData.getEntity(entityKey);
        if (!entity.getEffects().sortable) {
            throw new ServerError(ERROR_CODE.INVALID_EFFECT);
        }

        const sortedField = entity.getEffects().sortable!;

        const Model = BricksData.getModel(entityKey);

        const moved = await Model.findById(movedRowId);
        const target = await Model.findById(targerRowId);

        if (!(moved && target)) {
            throw new ServerError(ERROR_CODE.ENTITY_NOT_EXIST);
        }

        const movedPostion: number = moved.get(sortedField);
        const targetPostion: number = target.get(sortedField);

        if (movedPostion < targetPostion) {
            await Model.updateMany(
                { [sortedField]: { $lte: targetPostion, $gt: movedPostion } },
                { $inc: { [sortedField]: -1 } }
            );
        } else {
            await Model.updateMany(
                { [sortedField]: { $gte: targetPostion, $lt: movedPostion } },
                { $inc: { [sortedField]: 1 } }
            );
        }

        moved.set('position', targetPostion);
        await moved.save();
    }
}
