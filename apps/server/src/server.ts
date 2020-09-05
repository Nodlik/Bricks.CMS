import 'module-alias/register';

import express from 'express';
import cors from 'cors';
import mongoose, { Mongoose } from 'mongoose';

import indexRouter from './routes/index';
import metaRouter from './routes/meta';
import entityRouter from './routes/entities';
import apiRouter from './routes/api';

import { ConfigLoader } from './Loader/ConfigLoader';
import { ModuleLoader } from './Loader/ModuleLoader';
import { Bricks } from '@libs/Bricks';

require('dotenv').config();

const app: express.Application = express();
const port = 9000;

app.use(cors());
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use('/', indexRouter);
app.use('/meta', metaRouter);
app.use('/entities', entityRouter);
app.use('/api', apiRouter);

const connectToMongo = async (): Promise<Mongoose> => {
    return mongoose.connect(`mongodb://localhost:27017/${process.env.DB_NAME}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
};

const init = async () => {
    try {
        await connectToMongo();

        const bricks = new Bricks();

        const moduleLoader = new ModuleLoader(bricks);
        await moduleLoader.parseModuleDirectory();

        const loader = new ConfigLoader(bricks);
        await loader.parseConfigDirectory();

        loader.init();
        loader.createMongoModel();

        app.listen(port, () => {
            console.log(`Started at port ${port}`);
        });
    } catch (e) {
        console.error(e);
    }
};

init();

export default app;
