import express from 'express';
import { EntityRepository } from '../Model/Repository/EntityRepository';
import BricksData from '../Model/BricksData';

const router = express.Router();

router.get('/:key', async (req, res, next) => {
    const key = req.params.key;

    const meta = EntityRepository.GetEntityMeta(key);

    try {
        const docs = await EntityRepository.GetAll(key);

        res.json({
            entity: meta,
            documents: docs.map((_) => _.toJSON()),
        });
    } catch {
        res.json({
            entity: meta,
            documents: [],
        });
    }
});

router.get('/:key/first', async (req, res, next) => {
    const key = req.params.key;

    const item = await EntityRepository.GetFirst(key);

    res.json(item ? item.toJSON() : null);
});

router.get('/:key/:id', async (req, res, next) => {
    const key = req.params.key;
    const id = req.params.id;

    let item = null;
    try {
        item = await EntityRepository.GetOneById(key, id);
    } catch {}

    res.json(item ? item.toJSON() : null);
});

/** NEW ENTITY */
router.post('/:key', async (req, res, next) => {
    const key = req.params.key;

    try {
        res.json((await EntityRepository.New(key, req.body)).toJSON());
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

/** EDIT ENTITY */
router.put('/:key/:id', async (req, res, next) => {
    const key = req.params.key;
    const id = req.params.id;

    try {
        res.json((await EntityRepository.Update(key, id, req.body)).toJSON());
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

/** MOVE ENTITY (FUUUUCK!! NOT REST(())) */
router.patch('/move/:key/:movedId/:targetId', async (req, res, next) => {
    const key = req.params.key;
    const movedId = req.params.movedId;
    const targetId = req.params.targetId;

    try {
        const entity = BricksData.getEntity(key);

        const sortedField = entity.getEffects().sortable!;

        const moved = await BricksData.getModel(key).findById(movedId);
        const target = await BricksData.getModel(key).findById(targetId);

        const Model = BricksData.getModel(key);

        const docs =
            moved!.get(sortedField) < target!.get(sortedField)
                ? await Model.find(
                      Object.fromEntries([[sortedField, { $gt: target!.get(sortedField) }]])
                  )
                      .sort(`+${sortedField}`)
                      .limit(1)
                : await Model.find(
                      Object.fromEntries([[sortedField, { $lt: target!.get(sortedField) }]])
                  )
                      .sort(`-${sortedField}`)
                      .limit(1);

        let nextValue = 0;
        if (!docs[0]) {
            nextValue =
                moved!.get(sortedField) < target!.get(sortedField)
                    ? target!.get(sortedField) + 1
                    : target!.get(sortedField) - 1;
        } else {
            nextValue = docs[0].get(sortedField);
        }

        moved!.set(sortedField, (target!.get(sortedField) + nextValue) / 2);
        moved!.save();

        res.json({});
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

export default router;
