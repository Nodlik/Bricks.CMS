import { Breadcrumb, BreadcrumbItem } from '../UI/Breadcrumb';
import { BulletList, Code } from 'react-content-loader';

import { AiTwotoneHome } from 'react-icons/ai';
import BricksTemplate from '@libs/BricksTemplate';
import { Button } from '../UI/Button';
import { IBricksCollection } from '@libs/types/IBricksDocument';
import { Link } from 'react-router-dom';
import React from 'react';
import { RiAddCircleFill } from 'react-icons/ri';
import { useFetchRequest } from '@client/hooks/fetch';

export interface IKetEntityProps {
    entityKey: string;
}

export default function SingleEntity(props: IKetEntityProps): JSX.Element {
    const collection = useFetchRequest<IBricksCollection>(`/entities/${props.entityKey}`);

    if (!collection) {
        return (
            <div style={{ width: '50%', minWidth: '300px' }}>
                <Code />
                <BulletList />
            </div>
        );
    }

    const ComponentTemplate = BricksTemplate.getCollectionTemplate(collection.entity.template);

    return (
        <div className="page">
            <Breadcrumb>
                <BreadcrumbItem>
                    <Link to={`/`}>
                        <AiTwotoneHome />
                    </Link>
                </BreadcrumbItem>
                <BreadcrumbItem>
                    <span>{collection.entity.displayName}</span>
                </BreadcrumbItem>
            </Breadcrumb>

            <h1 className="pageHeader">
                <span>{collection.entity.displayName}</span>

                <Link to={`/entity/key/${collection.entity.key}/new`} className="headerButton">
                    <Button title="New" icon={RiAddCircleFill}></Button>
                </Link>
            </h1>

            <div>
                <ComponentTemplate
                    collection={collection}
                    templates={BricksTemplate}
                ></ComponentTemplate>
            </div>
        </div>
    );
}
