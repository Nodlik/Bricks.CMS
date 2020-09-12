import { EntityRepository } from '../Model/Repository/EntityRepository';
import express from 'express';

const router = express.Router();

router.get('/entity/:key', (req, res) => {
    // setTimeout(() => {
    const key = req.params.key;

    res.json(EntityRepository.GetEntityMeta(key).toJSON());
    // }, 10000);
});

export default router;
