import BricksData, { BricksSingleton } from '@server/Model/BricksData';

import express from 'express';

export abstract class Service {
    protected bricks: BricksSingleton = BricksData;
    protected readonly request: express.Request;
    protected readonly response: express.Response;

    public constructor(request: express.Request, response: express.Response) {
        this.request = request;
        this.response = response;
    }
}
