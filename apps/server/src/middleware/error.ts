import express, { NextFunction } from 'express';

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ERROR_CODE } from '@libs/Error';
import { ResponseService } from '@server/Services/ResponseService';
import { ServerError } from '@libs/types/APIError';
import { getService } from '@server/Services/Container/ServiceContainer';

export default function errorMiddleware(
    error: any,
    request: express.Request,
    response: express.Response,
    next: NextFunction
): void {
    const res = getService<ResponseService>('response', response);

    if (error.code === 'EBADCSRFTOKEN') {
        res.sendError(ERROR_CODE.CSRF_INVALID);
    } else if (error instanceof ServerError) {
        res.sendError(error.getCode());
    } else {
        next();
    }
}
