import { AuthService } from '@server/Services/AuthService';
import { ResponseService } from '@server/Services/ResponseService';
import { ServiceContainer } from '@server/Services/Container/ServiceContainer';
import { ValidateService } from '@server/Services/ValidateService';
import express from 'express';
import { middlewareFunction } from '@libs/types/AppTypes';

export default function serviceMiddleware(
    request: express.Request,
    response: express.Response,
    next: middlewareFunction
): void {
    const services = new ServiceContainer();
    services
        .set('auth', new AuthService(request, response))
        .set('response', new ResponseService(request, response))
        .set('validate', new ValidateService(request, response));

    response.locals['services'] = services;

    next();
}
