import * as API from '../utils/API';

import { Breadcrumb, BreadcrumbItem } from '@client/components/UI/Breadcrumb';
import { IBricksDocument, IEntity } from '@libs/types/IBricksDocument';
import { Link, useHistory, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import useAJAX, { RequestStatus } from '@client/hooks/ajax';

import { AiTwotoneHome } from 'react-icons/ai';
import { Alert } from '@client/components/UI/Alert';
import { AlertState } from '@client/components/UI/Alert/Alert';
import { Button } from '@client/components/UI/Button';
import { ButtonState } from '@client/components/UI/Button/Button';
import Entity from '../components/Entity/Entity';
import { List } from 'react-content-loader';
import useEntityFields from '@client/hooks/fields';
import { useFetchRequest } from '@client/hooks/fetch';

interface EnitityKeyRoute {
    key: string;
}

export default function NewEntityPage(): JSX.Element | null {
    const [error, setError] = useState<string>('');
    const fields = useEntityFields();

    const newEntity = useAJAX<IBricksDocument>();

    const history = useHistory();
    const params: EnitityKeyRoute = useParams();

    const entityMeta = useFetchRequest<IEntity>(`/meta/entity/${params.key}`);

    useEffect(() => {
        if (fields.isValid) {
            setError('');
        }
        if (newEntity.result.isError) {
            setError(`${newEntity.result.error!.errorCode}: ${newEntity.result.error!.errorText}`);
        }
    }, [fields.isValid, newEntity.result.isError, newEntity.result.error]);

    useEffect(() => {
        if (newEntity.result.status === RequestStatus.SUCCESS) {
            history.push(`/entity/key/${params.key}`);
        }
    }, [newEntity.result, params.key, history]);

    const onChange = (values: Record<string, unknown> | undefined, isValid: boolean) => {
        fields.set(values, isValid);
    };

    const save = () => {
        fields.isValid
            ? newEntity.send(API.POST(`/entities/${params.key}`, fields.get()))
            : setError('The form fields are filled in incorrectly. Check data');
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
            <div className="page__actions">
                <Button
                    title="Save"
                    onClick={(e) => {
                        e.preventDefault();
                        void save();
                    }}
                    state={
                        newEntity.result.status === RequestStatus.PENDING
                            ? ButtonState.PENDING
                            : ButtonState.ACTIVE
                    }
                ></Button>
            </div>
            <Alert text={error} state={AlertState.ERROR} />
        </div>
    );
}
