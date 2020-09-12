import 'module-alias/register';

import * as yup from 'yup';

import mongoose, { Mongoose } from 'mongoose';

import { Bricks } from '@libs/Bricks';
import BricksData from './Model/BricksData';
import { ConfigLoader } from './Loader/ConfigLoader';
import { ModuleLoader } from './Loader/ModuleLoader';
import apiRouter from './routes/api';
import authMiddleware from './middleware/auth';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import entityRouter from './routes/entities';
import express from 'express';
import indexRouter from './routes/index';
import metaRouter from './routes/meta';
import serviceMiddleware from './middleware/service';
import userRouter from './routes/user';

dotenv.config();

const app: express.Application = express();
const port = 9000;

app.use(cookieParser());
// app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(
    cors({
        credentials: true,
        origin: (origin, callback) => {
            callback(null, true);
        },
    })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));

app.use(serviceMiddleware);

app.use('/', authMiddleware, indexRouter);
app.use('/meta', authMiddleware, metaRouter);
app.use('/entities', authMiddleware, entityRouter);
app.use('/api', apiRouter);
app.use('/user', authMiddleware, userRouter);

const connectToMongo = async (): Promise<Mongoose> => {
    return mongoose.connect(`mongodb://localhost:27017/${process.env.DB_NAME || 'bricks'}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    });
};

const init = async () => {
    try {
        await connectToMongo();

        BricksData.updateJWTSecret();
        const bricks = new Bricks();

        const moduleLoader = new ModuleLoader(bricks);
        moduleLoader.parseModuleDirectory();

        const loader = new ConfigLoader(bricks);
        await loader.parseConfigDirectory();

        loader.init();
        loader.createMongoModel();

        await BricksData.initAuthService();

        app.listen(port, () => {
            console.log(`Started at port ${port}`);
        });
    } catch (e) {
        console.log(e);
    }
};

void init();

export default app;
