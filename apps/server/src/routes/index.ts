import { AuthService } from '@server/Services/AuthService';
import { ERROR_CODE } from '@libs/Error';
import { FolderRepository } from '../Model/Repository/FolderRepository';
import { ResponseService } from '@server/Services/ResponseService';
import express from 'express';
import { getService } from '@server/Services/Container/ServiceContainer';

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
    const response = getService<ResponseService>('response', res);
    const user = getService<AuthService>('auth', res).getUser();

    user
        ? response.sendSuccess({ user: user.toJSON(), token: req.csrfToken() })
        : response.sendError(ERROR_CODE.AUTH_REQUIRED);
});

router.get('/folders', (req, res) => {
    const m = FolderRepository.GetAll();

    res.json(m);
});

export default router;
