import { BeCare, Validate } from '@server/Services/ValidateService';

import BricksData from '../Model/BricksData';
import { BricksDocument } from '@server/Model/BricksDocument';
import { EntityRepository } from '../Model/Repository/EntityRepository';
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import express from 'express';
import { string } from 'yup';

require('express-async-errors');

const router = express.Router();

router.get('/:key', async (req, res) => {
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

router.get('/:key/first', async (req, res) => {
    const key = req.params.key;

    const item = await EntityRepository.GetFirst(key);

    res.json(item ? item.toJSON() : null);
});

/**
 * Get entity by document id
 */
router.get('/:key/:id', async (req, res) => {
    const { key, id } = Validate(
        req.params,
        { key: string().required(), id: string().required() },
        res
    );

    res.json((await EntityRepository.GetOneById(String(key), String(id))).toJSON());
});

/** NEW ENTITY */
router.post('/:key', async (req, res) => {
    const { key } = Validate(req.params, { key: string().required() }, res);

    res.json((await EntityRepository.New(key as string, req.body)).toJSON());
});

/** EDIT ENTITY */
router.put('/:key/:id', async (req, res) => {
    const { key, id } = Validate(
        req.params,
        { key: string().required(), id: string().required() },
        res
    );

    res.json((await EntityRepository.Update(key as string, id as string, req.body)).toJSON());
});

/** MOVE ENTITY (FUUUUCK!! NOT REST(())) */
router.patch('/move/:key/:movedId/:targetId', async (req, res) => {
    const key = req.params.key;
    const movedId = req.params.movedId;
    const targetId = req.params.targetId;

    try {
        const entity = BricksData.getEntity(key);

        if (entity.getEffects().sortable) {
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
                        ? parseFloat(target!.get(sortedField)) + 1
                        : parseFloat(target!.get(sortedField)) - 1;
            } else {
                nextValue = parseFloat(docs[0].get(sortedField));
            }

            moved!.set(sortedField, (parseFloat(target!.get(sortedField)) + nextValue) / 2);
            await moved!.save();
        }

        res.json({});
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

export default router;
