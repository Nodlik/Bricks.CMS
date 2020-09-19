import * as yup from 'yup';

import { EntityRepository } from '../Model/Repository/EntityRepository';
import { Validate } from '@server/Services/ValidateService';
import express from 'express';

require('express-async-errors');

const router = express.Router();

router.get('/entity/:key', (req, res) => {
    const params = Validate(req.params, { key: yup.string().required() }, res);

    res.json(EntityRepository.GetEntityMeta(String(params.key)).toJSON());
});

export default router;
