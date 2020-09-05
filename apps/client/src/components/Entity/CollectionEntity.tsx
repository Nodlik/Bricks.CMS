import React, { useEffect, useState, Suspense } from 'react';
import * as API from '../../utils/API';
import { IKetEntityProps } from '../../utils/types';
import { IBricksCollection } from '@libs/types/IBricksDocument';
import BricksTemplate from '@libs/BricksTemplate';
import { Link } from 'react-router-dom';

export default function SingleEntity(props: IKetEntityProps) {
    const [collection, setCollection] = useState<IBricksCollection>();

    useEffect(() => {
        (async () => {
            setCollection(undefined);
            const data: IBricksCollection = await API.GET(`entities/${props.entityKey}`);

            setCollection(data);
        })();
    }, [props.entityKey]);

    if (!collection) return <div>Loading...</div>;

    const ComponentTemplate = BricksTemplate.getCollectionTemplate(collection.entity.template);

    return (
        <div>
            <div className="pageTitle">
                <h1 className="pageHeader">{collection.entity.displayName}</h1>
                <Link to={`/entity/key/${collection.entity.key}/new`}>
                    <button>NEW</button>
                </Link>
            </div>
            <div>
                <ComponentTemplate
                    collection={collection}
                    templates={BricksTemplate}
                ></ComponentTemplate>
            </div>
        </div>
    );
}
