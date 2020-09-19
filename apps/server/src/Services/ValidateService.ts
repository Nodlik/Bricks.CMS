import * as yup from 'yup';

import { ResponseService, SendError } from './ResponseService';

import { ERROR_CODE } from '@libs/Error';
import { ServerError } from '@libs/types/APIError';
import { Service } from './Service';
import express from 'express';
import { getService } from './Container/ServiceContainer';

export class ValidateService extends Service {
    public constructor(request: express.Request, response: express.Response) {
        super(request, response);
    }

    public validate(
        data: Record<string, unknown>,
        schema: yup.ObjectSchemaDefinition<any>
    ): Record<string, unknown> {
        try {
            const validator = yup.object().shape(schema);
            const result = validator.validateSync(data);

            return result as Record<string, unknown>;
        } catch (e) {
            throw new ServerError(ERROR_CODE.VALIDATE_REQUEST_ERROR);
        }
    }

    public checkExist(entity: unknown | unknown[]): unknown | unknown[] {
        const items = Array.isArray(entity) ? entity : [entity];

        for (const item of items) {
            if (!item) {
                SendError(ERROR_CODE.ENTITY_NOT_EXIST, this.response);
            }
        }

        return entity;
    }
}

export function Validate(
    data: Record<string, unknown>,
    schema: yup.ObjectSchemaDefinition<any>,
    response: express.Response
): Record<string, unknown> {
    return getService<ValidateService>('validate', response).validate(data, schema);
}

export function CheckExist(
    entity: unknown | unknown[],
    response: express.Response
): unknown | unknown[] {
    return getService<ValidateService>('validate', response).checkExist(entity);
}

export async function BeCare<T>(value: Promise<T>, response: express.Response): Promise<T | null> {
    const res = getService<ResponseService>('response', response);

    try {
        return await value;
    } catch (e) {
        e instanceof ServerError ? res.sendError(e.getCode()) : res.sendError(0);

        response.end();
        return null;
    }
}
