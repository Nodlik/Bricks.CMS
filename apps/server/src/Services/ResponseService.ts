import { ERROR_LIST } from '@libs/Error';
import { Service } from './Service';
import express from 'express';

export class ResponseService extends Service {
    public constructor(request: express.Request, response: express.Response) {
        super(request, response);
    }

    public sendError(errorCode = 0): void {
        const error = ERROR_LIST[errorCode];
        if (error) {
            this.response.status(error[0]).json({
                code: errorCode,
                text: error[1],
            });
        } else {
            this.response.status(500).json({
                code: 0,
                text: 'Unhandled error',
            });
        }
    }

    public sendSuccess(data: Record<string, unknown> | unknown): void {
        this.response.status(200).json(data);
    }
}
