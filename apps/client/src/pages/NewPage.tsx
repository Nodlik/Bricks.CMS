import React, { useState, useEffect } from 'react';
import * as API from '../utils/API';
import { useParams, useHistory } from 'react-router-dom';
import { IEntity } from '@libs/types/IBricksDocument';
import Entity from '../components/Entity/Entity';

interface EnitityKeyRoute {
    key: string;
}

export default function NewEntityPage() {
    const [error, setError] = useState<string>('');
    const [entityMeta, setEntityMeta] = useState<IEntity>();
    const [fields, setFields] = useState<Map<string, any>>(new Map<string, any>());

    const history = useHistory();
    const params: EnitityKeyRoute = useParams();

    useEffect(() => {
        (async () => {
            const data: IEntity = await API.GET(`meta/entity/${params.key}`);

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
            setError('Validation error, check data');
        }
    };

    if (!entityMeta) return null;

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
                    save();
                }}
            >
                SAVE
            </button>
        </div>
    );
}
