import BricksData from '../BricksData';
import { BricksDocument } from '../BricksDocument';
import { ERROR_CODE } from '@libs/Error';
import { Entity } from '../Unit/Entity';
import { ServerError } from '@libs/types/APIError';
import mongoose from 'mongoose';

export class EntityRepository {
    public static async SaveDocument(
        doc: mongoose.Document,
        entity: Entity
    ): Promise<mongoose.Document> {
        if (entity.getEffects().sortable) {
            if (doc.isNew) {
                const last = await EntityRepository.GetLast(entity.getKey());
                const newPostion = last ? last?.getPosition() + 1 : 0;

                doc.set(entity.getEffects().sortable!, newPostion);
            }
        }

        for (const field of entity.getField()) {
            if (field.getKey() in doc) {
                const action = field.getEvents().beforeSave;
                if (action instanceof Function) {
                    doc.set(field.getKey(), action(doc, BricksData));
                }
            }
        }

        return await doc.save();
    }

    public static GetEntityMeta(entityKey: string): Entity {
        return BricksData.getEntity(entityKey);
    }

    public static async New(
        entityKey: string,
        values: Record<string, unknown>
    ): Promise<BricksDocument> {
        const entity = BricksData.getEntity(entityKey);

        const row: any = {};

        for (const field of entity.getField()) {
            if (!(field.getKey() in values)) {
                if (field.required()) {
                    throw new ServerError(ERROR_CODE.VALIDATE_ENTITY_ERROR);
                }

                row[field.getKey()] = null;
            } else {
                const val = await BricksData.getBricks().getFieldValue(
                    values[field.getKey()],
                    field
                );
                row[field.getKey()] = val;
            }
        }

        const Model = BricksData.getModel(entityKey);
        const newEntity = new Model(row);

        try {
            await this.SaveDocument(newEntity, entity);
        } catch (e) {
            const code =
                e instanceof mongoose.Error.ValidationError ? ERROR_CODE.VALIDATE_ENTITY_ERROR : 0;

            throw new ServerError(code);
        }
        return this.GetOneById(entityKey, newEntity._id);
    }

    public static async Update(
        entityKey: string,
        id: string,
        values: Record<string, unknown>
    ): Promise<BricksDocument> {
        const entity = BricksData.getEntity(entityKey);

        try {
            const doc = await BricksData.getModel(entityKey).findById(id);
            if (!doc) {
                throw new ServerError(ERROR_CODE.DOCUMENT_NOT_EXIST);
            }

            for (const [key, value] of Object.entries(values)) {
                if (entity.hasField(key)) {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    const field = entity.getFieldByKey(key)!;
                    doc.set(key, await BricksData.getBricks().getFieldValue(value, field));
                } else if (key === entity.getEffects().sortable) {
                    doc.set(key, value);
                }
            }

            await this.SaveDocument(doc, entity);
        } catch (e) {
            if (e instanceof ServerError) {
                throw new ServerError(e.getCode());
            } else {
                throw new ServerError(ERROR_CODE.VALIDATE_ENTITY_ERROR);
            }
        }

        return this.GetOneById(entityKey, id);
    }

    public static async GetFirst(entityKey: string): Promise<BricksDocument | null> {
        const entity = BricksData.getEntity(entityKey);

        if (!BricksData.hasModel(entityKey)) {
            return null;
        }

        const Model = BricksData.getModel(entityKey);

        if ((await Model.countDocuments()) === 0) {
            return null;
        }

        const docs = await Model.find();

        return new BricksDocument(entity, docs[0]);
    }

    public static async GetAll(entityKey: string): Promise<BricksDocument[]> {
        const entity = BricksData.getEntity(entityKey);
        const query = BricksData.getModel(entityKey).find();

        if (entity.getEffects().sortable) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            void query.sort(`-${entity.getEffects().sortable!}`);
        }

        const docs = await query;

        return docs.map((_) => new BricksDocument(entity, _));
    }

    public static async GetLast(entityKey: string): Promise<BricksDocument | null> {
        const entity = BricksData.getEntity(entityKey);
        const query = BricksData.getModel(entityKey).findOne();

        if (entity.getEffects().sortable) {
            void query.sort(`-${entity.getEffects().sortable!}`);
        }

        const doc = await query;
        if (!doc) {
            return null;
        }

        return new BricksDocument(entity, doc);
    }

    public static async Count(entityKey: string): Promise<number> {
        return await BricksData.getModel(entityKey).countDocuments();
    }

    public static async GetOneById(entityKey: string, id: string): Promise<BricksDocument> {
        const entity = BricksData.getEntity(entityKey);
        try {
            const doc = await BricksData.getModel(entityKey).findById(id);

            if (doc !== null) {
                return new BricksDocument(entity, doc);
            }

            throw new ServerError(ERROR_CODE.DOCUMENT_NOT_EXIST);
        } catch (e) {
            throw new ServerError(ERROR_CODE.DOCUMENT_NOT_EXIST);
        }
    }
}
