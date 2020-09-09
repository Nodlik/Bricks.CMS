import { Service } from '../Service';
import express from 'express';

export function getService<ServiceType>(
    serviceName: string,
    response: express.Response
): ServiceType {
    if ('services' in response.locals) {
        return response.locals['services'].get(serviceName) as ServiceType;
    }

    throw new Error('Service not found');
}

export class ServiceContainer {
    protected readonly services: Map<string, Service> = new Map();

    public set(name: string, service: Service): ServiceContainer {
        this.services.set(name, service);
        return this;
    }

    public get(name: string): Service {
        if (!this.services.has(name)) {
            throw new Error('Service not found');
        }

        return this.services.get(name)!;
    }
}
