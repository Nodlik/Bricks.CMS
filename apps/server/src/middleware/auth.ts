import * as jwt from 'jsonwebtoken';

import { JWTData, middlewareFunction } from '@libs/types/AppTypes';

import BricksData from '@server/Model/BricksData';
import { ERROR_CODE } from '@libs/Error';
import { SendError } from '@server/Services/ResponseService';
import { UserRepository } from '@server/Model/Repository/UserRepository';
import express from 'express';

const LOGIN_URL = ['/user/login', '/login', '/user/token', '/token'];

export default async function authMiddleware(
    request: express.Request,
    response: express.Response,
    next: middlewareFunction
): Promise<void> {
    if (LOGIN_URL.includes(request.url.replace('?', ''))) {
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
            SendError(ERROR_CODE.AUTH_REQUIRED, response);
        }
    }
}
