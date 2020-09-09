import * as API from '../utils/API';

import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { APIError } from '@client/utils/APIError';
import Entity from '../components/Entity/Entity';
import { IEntity } from '@libs/types/IBricksDocument';

interface EnitityKeyRoute {
    key: string;
}

export default function NewEntityPage(): JSX.Element | null {
    const [error, setError] = useState<string>('');
    const [entityMeta, setEntityMeta] = useState<IEntity>();
    const [fields, setFields] = useState<Map<string, any>>(new Map<string, any>());

    const history = useHistory();
    const params: EnitityKeyRoute = useParams();

    useEffect(() => {
        void (async () => {
            const data: IEntity = await API.GET(`/meta/entity/${params.key}`);

            setEntityMeta(data);
        })();
    }, [params.key]);

    const onChange = (values: Map<string, any>) => {
        setFields(values);
    };

    const save = async () => {
        setError('');

        try {
            const res = await API.POST(
                `entities/${params.key}`,
                Object.fromEntries(fields.entries())
            );

            history.push(`/entity/key/${params.key}`);
        } catch (e) {
            e instanceof APIError ? setError(e.message) : setError('Unhandled error');
        }
    };

    if (!entityMeta) {
        return null;
    }

    return (
        <div>
            <h1 className="pageHeader">{entityMeta.displayName} - NEW ITEM</h1>
            <div style={{ color: 'red' }}>{error}</div>
            <hr />
            <div>
                <Entity document={entityMeta} onChange={onChange} />
            </div>
            <hr />
            <button
                onClick={(e) => {
                    e.preventDefault();
                    void save();
                }}
            >
                SAVE
            </button>
        </div>
    );
}
