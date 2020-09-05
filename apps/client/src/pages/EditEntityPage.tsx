import React, { useState, useEffect } from 'react';
import * as API from '../utils/API';
import { useParams } from 'react-router-dom';
import { IBricksDocument } from '@libs/types/IBricksDocument';
import Entity from '../components/Entity/Entity';

interface EnitityKeyRoute {
    key: string;
    id: string;
}

export default function EditEntityPage() {
    const [error, setError] = useState<string>('');
    const [document, setDocument] = useState<IBricksDocument>();
    const [fields, setFields] = useState<Map<string, any>>(new Map<string, any>());

    const params: EnitityKeyRoute = useParams();

    useEffect(() => {
        (async () => {
            const data: IBricksDocument = await API.GET(`entities/${params.key}/${params.id}`);

            setDocument(data);
        })();
    }, [params.key]);

    const onChange = (values: Map<string, any>) => {
        setFields(values);
    };

    const save = async () => {
        setError('');

        try {
            const newDocument = await API.PUT(
                `entities/${params.key}/${document!.id}`,
                Object.fromEntries(fields.entries())
            );

            setDocument(undefined);
            setDocument(newDocument);
        } catch {
            setError('Validate error, check data');
        }
    };

    if (!document) return <div>Loading...</div>;

    return (
        <div>
            <h1 className="pageHeader">{document.displayName} - EDIT ITEM</h1>
            <div style={{ color: 'red' }}>{error}</div>
            <hr />
            <div>
                <Entity document={document} onChange={onChange} />
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
