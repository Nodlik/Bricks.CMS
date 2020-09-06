import express from 'express';
import BricksData from '../Model/BricksData';
import { API_ACTION, ENTITY_TYPE } from '@libs/types/IConfigTypes';

const router = express.Router();

router.get('/:key', async (req, res) => {
    const key = req.params.key;

    try {
        const entity = BricksData.getEntity(key);
        if (!entity.hasApiAction(API_ACTION.FETCH)) {
            throw new Error('The document is not fetchable');
        }

        const docs =
            entity.getType() === ENTITY_TYPE.COLLECTION
                ? await BricksData.getModel(key).find()
                : (await BricksData.getModel(key).find().limit(1))[0];

        res.json(docs);
    } catch (e) {
        res.status(404).json({ Not: e });
    }
});

export default router;
