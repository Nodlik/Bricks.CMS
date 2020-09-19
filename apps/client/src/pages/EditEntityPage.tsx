import * as API from '../utils/API';

import { Breadcrumb, BreadcrumbItem } from '@client/components/UI/Breadcrumb';
import { Link, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import useAJAX, { RequestStatus } from '@client/hooks/ajax';

import { AiTwotoneHome } from 'react-icons/ai';
import { Alert } from '@client/components/UI/Alert';
import { AlertState } from '@client/components/UI/Alert/Alert';
import { Button } from '@client/components/UI/Button';
import { ButtonState } from '@client/components/UI/Button/Button';
import Entity from '../components/Entity/Entity';
import { IBricksDocument } from '@libs/types/IBricksDocument';
import { List } from 'react-content-loader';
import { getDisplayTitle } from '@client/utils/document';
import useEntityFields from '@client/hooks/fields';
import { useFetchRequest } from '@client/hooks/fetch';

interface EnitityKeyRoute {
    key: string;
    id: string;
}

export default function EditEntityPage(): JSX.Element {
    const [error, setError] = useState<string>('');
    const [document, setDocument] = useState<IBricksDocument>();

    const params: EnitityKeyRoute = useParams();
    const currentDocument = useFetchRequest<IBricksDocument>(
        `/entities/${params.key}/${params.id}`
    );
    const editEntity = useAJAX<IBricksDocument>();

    const fields = useEntityFields();

    useEffect(() => {
        setDocument(currentDocument);
    }, [currentDocument]);

    useEffect(() => {
        if (fields.isValid) {
            setError('');
        }
        if (editEntity.result.isError) {
            setError(
                `${editEntity.result.error!.errorCode}: ${editEntity.result.error!.errorText}`
            );
        } else if (editEntity.result.response) {
            setDocument(editEntity.result.response);
        }
    }, [
        fields.isValid,
        editEntity.result.isError,
        editEntity.result.error,
        editEntity.result.isDone,
        editEntity.result.response,
    ]);

    const onChange = (values: Record<string, unknown> | undefined, isValid: boolean) => {
        fields.set(values, isValid);
    };

    if (!document) {
        return <List />;
    }

    const save = () => {
        fields.isValid
            ? editEntity.send(API.PUT(`/entities/${params.key}/${document.id}`, fields.get()))
            : setError('The form fields are filled in incorrectly. Check data');
    };

    return (
        <div className="page">
            <Breadcrumb>
                <BreadcrumbItem>
                    <Link to={`/`}>
                        <AiTwotoneHome />
                    </Link>
                </BreadcrumbItem>
                <BreadcrumbItem>
                    <Link to={`/entity/key/${document.key}`}>{document.displayName}</Link>
                </BreadcrumbItem>
                <BreadcrumbItem isCurrent={true}>
                    <span>{getDisplayTitle(document) || 'Edit item'}</span>
                </BreadcrumbItem>
            </Breadcrumb>

            <h1 className="pageHeader">
                <span>{document.displayName} - editing</span>
            </h1>

            <div>
                <Entity isNew={false} document={document} onChange={onChange} />
            </div>
            <div className="page__actions">
                <Button
                    title="Save"
                    onClick={() => {
                        save();
                    }}
                    state={
                        editEntity.result.status === RequestStatus.PENDING
                            ? ButtonState.PENDING
                            : ButtonState.ACTIVE
                    }
                ></Button>
            </div>
            <Alert text={error} state={AlertState.ERROR} />
        </div>
    );
}
