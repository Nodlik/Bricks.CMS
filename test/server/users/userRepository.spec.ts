import BricksData from '@server/Model/BricksData';
import { UserRepository } from '@server/Model/Repository/UserRepository';
import mongoose from 'mongoose';

describe('User Repository test', () => {
    test('added user', async () => {
        await mongoose.connect(`mongodb://localhost:27017/${process.env.DB_NAME || 'bricks'}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });

        await BricksData.initAuthService();

        const newUser = await UserRepository.New(
            'temp user',
            'temp' + Math.random().toString(),
            'temppassword'
        );

        expect(newUser.getId()).toBeTruthy();
        expect(await newUser.checkPassword('temppassword')).toBeTruthy();
        expect(await newUser.checkPassword('wrong')).toBeFalsy();

        void mongoose.disconnect();
    });
});
