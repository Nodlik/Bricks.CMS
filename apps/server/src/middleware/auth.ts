import * as jwt from 'jsonwebtoken';

import { JWTData, middlewareFunction } from '@libs/types/AppTypes';

import BricksData from '@server/Model/BricksData';
import { ERROR_CODE } from '@libs/Error';
import { ResponseService } from '@server/Services/ResponseService';
import { UserRepository } from '@server/Model/Repository/UserRepository';
import express from 'express';
import { getService } from '@server/Services/Container/ServiceContainer';

const LOGIN_URL = ['/user/login', '/login'];

export default async function authMiddleware(
    request: express.Request,
    response: express.Response,
    next: middlewareFunction
): Promise<void> {
    const res = getService<ResponseService>('response', response);

    if (LOGIN_URL.includes(request.url)) {
        next();
    } else {
        try {
            const data = jwt.verify(request.cookies['JWT'], BricksData.getJWTSecret()) as JWTData;

            const user = await UserRepository.GetOneById(data.id);
            if (!user) {
                throw new Error('Invalid user id');
            }

            response.locals['userData'] = data;
            response.locals['user'] = user;

            next();
        } catch (e) {
            res.sendError(ERROR_CODE.AUTH_REQUIRED);
        }
    }
}
