import express from 'express';
import BricksData from '../Model/BricksData';
import { FolderRepository } from '../Model/Repository/FolderRepository';
import { EntityRepository } from '../Model/Repository/EntityRepository';

const router = express.Router();

router.get('/entity/:key', async (req, res, next) => {
    const key = req.params.key;

    res.json( EntityRepository.GetEntityMeta(key).toJSON() );
});

export default router;
