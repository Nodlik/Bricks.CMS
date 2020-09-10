import { AuthService } from '@server/Services/AuthService';
import { ERROR_CODE } from '@libs/Error';
import { ResponseService } from '@server/Services/ResponseService';
import express from 'express';
import { getService } from '@server/Services/Container/ServiceContainer';

const router = express.Router();

router.post('/login', async (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    // setTimeout(async () => {
    const response = getService<ResponseService>('response', res);
    const auth = getService<AuthService>('auth', res);

    const jwtToken = await auth.signin(req.body['login'], req.body['password']);

    if (jwtToken === null) {
        response.sendError(ERROR_CODE.WRONG_PASSWORD);
    } else {
        res.cookie('JWT', jwtToken, {
            maxAge: 86_400_000,
            httpOnly: true,
            path: '/',
        })
            .status(200)
            .json({ token: jwtToken });
    }
    // }, 3000);
});

export default router;
