import BricksData from '../BricksData';
import { User } from '../Unit/Essential/User';
import crypto from 'crypto';

export class UserRepository {
    public static async New(name: string, login: string, password: string): Promise<User> {
        const salt = crypto.randomBytes(5).toString('hex');

        const UserModel = BricksData.getUserModel();
        const newUser = await UserModel.create({
            login: login.toLowerCase().trim(),
            name: name,
            salt: salt,
            password: await User.HashPassword(password, salt),
        });

        return new User(newUser);
    }

    public static async GetUserByLoginAndPassword(
        login: string,
        password: string
    ): Promise<User | null> {
        const user = await UserRepository.GetOneByLogin(login);
        if (!user || !(await user.checkPassword(password))) {
            return null;
        }

        return user;
    }

    public static async CreateDefault(): Promise<User> {
        return UserRepository.New('Default Admin', 'admin', 'password');
    }

    public static async GetAll(): Promise<User[]> {
        const users = await BricksData.getUserModel().find();

        return users.map((_) => new User(_));
    }

    public static async GetOneById(id: string): Promise<User | null> {
        const doc = await BricksData.getUserModel().findById(id);

        if (!doc) {
            return null;
        }

        return new User(doc);
    }

    public static async GetOneByLogin(login: string): Promise<User | null> {
        const doc = await BricksData.getUserModel().findOne({ login: login });

        if (!doc) {
            return null;
        }

        return new User(doc);
    }
}
