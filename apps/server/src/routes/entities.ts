import { EntityRepository } from '../Model/Repository/EntityRepository';
import { SortableEffect } from '@server/Model/BricksEffect/Sortable';
import { Validate } from '@server/Services/ValidateService';
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import express from 'express';
import { string } from 'yup';

require('express-async-errors');

const router = express.Router();

/**
 * Get all documents of the specified entity
 */
router.get('/:key', async (req, res) => {
    const { key } = Validate(req.params, { key: string().required() }, res);

    const meta = EntityRepository.GetEntityMeta(key as string);

    try {
        const docs = await EntityRepository.GetAll(key as string);

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

/**
 * Get the first document of the specified entity
 */
router.get('/:key/first', async (req, res) => {
    const { key } = Validate(req.params, { key: string().required() }, res);

    const item = await EntityRepository.GetFirst(key as string);

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

/**
 * Create new document by entity key
 */
router.post('/:key', async (req, res) => {
    const { key } = Validate(req.params, { key: string().required() }, res);

    res.json((await EntityRepository.New(key as string, req.body)).toJSON());
});

/**
 * Edit document by entity key
 */
router.put('/:key/:id', async (req, res) => {
    const { key, id } = Validate(
        req.params,
        { key: string().required(), id: string().required() },
        res
    );

    res.json((await EntityRepository.Update(key as string, id as string, req.body)).toJSON());
});

/**
 * Move and shift documents
 */
router.patch('/move/:key/:movedId/:targetId', async (req, res) => {
    const { key, movedId, targetId } = Validate(
        req.params,
        { key: string().required(), movedId: string().required(), targetId: string().required() },
        res
    );

    await SortableEffect.MoveAndShift(key, movedId, targetId);

    res.json(true);
});

export default router;
