import * as jwt from 'jsonwebtoken';

import BricksData from '@server/Model/BricksData';
import { Service } from './Service';
import { User } from '@server/Model/Unit/Essential/User';
import { UserRepository } from '@server/Model/Repository/UserRepository';
import express from 'express';

export class AuthService extends Service {
    public constructor(request: express.Request, response: express.Response) {
        super(request, response);
    }

    private getToken(user: User): string {
        return jwt.sign(
            { id: user.getId(), name: user.getName(), login: user.getLogin() },
            BricksData.getJWTSecret(),
            { expiresIn: '1d' }
        );
    }

    public getUser(): User | null {
        if ('user' in this.response.locals) {
            return this.response.locals['user'] as User;
        }

        return null;
    }

    public async signin(login: string, password: string): Promise<string | null> {
        const user = await UserRepository.GetUserByLoginAndPassword(login, password);
        if (!user) {
            return null;
        }

        return this.getToken(user);
    }
}
