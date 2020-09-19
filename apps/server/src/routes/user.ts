import { ResponseService, SendError } from '@server/Services/ResponseService';

import { AuthService } from '@server/Services/AuthService';
import { ERROR_CODE } from '@libs/Error';
import { Validate } from '@server/Services/ValidateService';
import express from 'express';
import { getService } from '@server/Services/Container/ServiceContainer';
import { string } from 'yup';

require('express-async-errors');

const router = express.Router();

router.post('/login', async (req, res) => {
    const auth = getService<AuthService>('auth', res);

    const { login, password } = Validate(
        req.body,
        {
            login: string().required(),
            password: string().required(),
        },
        res
    );

    const jwtToken = await auth.signin(login as string, password as string);

    if (jwtToken === null) {
        SendError(ERROR_CODE.WRONG_PASSWORD, res);
    } else {
        res.cookie('JWT', jwtToken, {
            maxAge: 86_400_000,
            httpOnly: true,
            path: '/',
        })
            .status(200)
            .json({ token: jwtToken });
    }
});

router.get('/token', (req, res) => {
    const response = getService<ResponseService>('response', res);
    const auth = getService<AuthService>('auth', res);

    auth.getUser()
        ? response.sendError(ERROR_CODE.UNAUTH_ONLY)
        : response.sendSuccess(req.csrfToken());
});

export default router;
