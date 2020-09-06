import BricksData from '../BricksData';
import mongoose from 'mongoose';
import { BricksDocument } from '../BricksDocument';
import { Entity } from '../Unit/Entity';

export class EntityRepository {
    public static async SaveDocument(
        doc: mongoose.Document,
        entity: Entity
    ): Promise<mongoose.Document> {
        if (entity.getEffects().sortable) {
            if (doc.isNew) {
                doc.set(
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    entity.getEffects().sortable!,
                    await EntityRepository.Count(entity.getKey())
                );
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
                    throw new Error(`Field ${field.getKey()} is required`);
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

        await this.SaveDocument(newEntity, entity);
        return this.GetOneById(entityKey, newEntity._id);
    }

    public static async Update(
        entityKey: string,
        id: string,
        values: Record<string, unknown>
    ): Promise<BricksDocument> {
        const entity = BricksData.getEntity(entityKey);
        const doc = await BricksData.getModel(entityKey).findById(id);

        if (!doc) {
            throw new Error(`The entity with id ${id} was not found`);
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

    public static async Count(entityKey: string): Promise<number> {
        return await BricksData.getModel(entityKey).countDocuments();
    }

    public static async GetOneById(entityKey: string, id: string): Promise<BricksDocument> {
        const entity = BricksData.getEntity(entityKey);
        const doc = await BricksData.getModel(entityKey).findById(id);
        if (!doc) {
            throw new Error(`The entity with id ${id} was not found`);
        }

        return new BricksDocument(entity, doc);
    }
}
