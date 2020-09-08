import express from 'express';
import { FolderRepository } from '../Model/Repository/FolderRepository';

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
    res.json({});
});

router.get('/folders', (req, res) => {
    const m = FolderRepository.GetAll();

    res.json(m);
});

export default router;
