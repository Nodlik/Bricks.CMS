import * as API from '../utils/API';

import { Breadcrumb, BreadcrumbItem } from '@client/components/UI/Breadcrumb';
import { Link, useHistory, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import useAJAX, { RequestStatus } from '@client/hooks/ajax';

import { APIError } from '@client/utils/APIError';
import { AiTwotoneHome } from 'react-icons/ai';
import { Button } from '@client/components/UI/Button';
import Entity from '../components/Entity/Entity';
import { IEntity } from '@libs/types/IBricksDocument';
import { List } from 'react-content-loader';

interface EnitityKeyRoute {
    key: string;
}

export default function NewEntityPage(): JSX.Element | null {
    const [error, setError] = useState<string>('');
    const [entityMeta, setEntityMeta] = useState<IEntity>();
    const [fields, setFields] = useState<Map<string, any>>(new Map<string, any>());

    const { result, send } = useAJAX<IEntity>();

    const history = useHistory();
    const params: EnitityKeyRoute = useParams();

    useEffect(() => {
        send(API.GET(`/meta/entity/${params.key}`));
    }, [params.key, send]);

    useEffect(() => {
        if (result.status === RequestStatus.SUCCESS) {
            setEntityMeta(result.response);
        }
    }, [result.status, result.response]);

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
        return <List />;
    }

    return (
        <div className="page">
            <Breadcrumb>
                <BreadcrumbItem>
                    <Link to={`/`}>
                        <AiTwotoneHome />
                    </Link>
                </BreadcrumbItem>
                <BreadcrumbItem>
                    <Link to={`/entity/key/${entityMeta.key}`}>{entityMeta.displayName}</Link>
                </BreadcrumbItem>
                <BreadcrumbItem isCurrent={true}>
                    <span>New item</span>
                </BreadcrumbItem>
            </Breadcrumb>

            <h1 className="pageHeader">
                <span>{entityMeta.displayName} - NEW ITEM</span>
            </h1>

            <div>
                <Entity isNew={true} document={entityMeta} onChange={onChange} />
            </div>
            {/* <button
                onClick={(e) => {
                    e.preventDefault();
                    void save();
                }}
            >
                SAVE
            </button> */}
            <div className="page__actions">
                <Button title="New"></Button>
            </div>
        </div>
    );
}
