import express from 'express';
import { FolderRepository } from '../Model/Repository/FolderRepository';
import BricksData from '../Model/BricksData';
import { EntityRepository } from '../Model/Repository/EntityRepository';
// import { Bricks } from '../Model/Bricks';
const router = express.Router();

/* GET home page. */
router.get('/', async (req, res, next) => {
    res.json({});
});

router.get('/folders', async (req, res, next) => {
    const m = await FolderRepository.GetAll();
    
    res.json(m);
});

export default router;
