import express from 'express';
import { EntityRepository } from '../Model/Repository/EntityRepository';

const router = express.Router();

router.get('/entity/:key', (req, res) => {
    const key = req.params.key;

    res.json(EntityRepository.GetEntityMeta(key).toJSON());
});

export default router;
