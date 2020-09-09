import * as argon2 from 'argon2';

import mongoose, { Schema } from 'mongoose';

import BricksData from '../../BricksData';
import { JWTData } from '@libs/types/AppTypes';

export class User {
    protected id: string;
    protected name: string;
    protected login: string;
    protected password: string;
    protected salt: string;

    public constructor(doc: mongoose.Document) {
        this.id = doc._id;
        this.name = doc.get('name');
        this.login = doc.get('login');
        this.password = doc.get('password');
        this.salt = doc.get('salt');
    }

    public getName(): string {
        return this.name;
    }

    public getLogin(): string {
        return this.login;
    }

    public getId(): string {
        return this.id;
    }

    public toJSON(): JWTData {
        return {
            id: this.id,
            name: this.name,
            login: this.login,
        };
    }

    public async checkPassword(password: string): Promise<boolean> {
        return this.password === (await User.HashPassword(password, this.salt));
    }

    public static async HashPassword(password: string, solt: string): Promise<string> {
        return await argon2.hash(password, {
            salt: Buffer.from(solt + BricksData.getGlobalSalt()),
        });
    }

    public static getMongoSchema(): Schema {
        return new Schema({
            name: {
                type: String,
                required: true,
            },
            login: {
                type: String,
                unique: true,
                required: true,
            },
            password: {
                type: String,
                required: true,
            },
            salt: {
                type: String,
                required: true,
            },
        });
    }
}
