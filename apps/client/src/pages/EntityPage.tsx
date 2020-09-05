import React, { useState, useEffect } from 'react';
import * as API from '../utils/API';
import { useParams } from 'react-router-dom';
import { IEntity } from '@libs/types/IBricksDocument';
import { ENTITY_TYPE } from '@libs/types/IConfigTypes';
import SingleEntity from '../components/Entity/SingleEntity';
import CollectionEntity from '../components/Entity/CollectionEntity';

interface EnitityKeyRoute {
    key: string;
}

export default function EntityPage() {
    const [entityMeta, setEntityMeta] = useState<IEntity>();
    const params: EnitityKeyRoute = useParams();

    useEffect(() => {
        (async () => {
            const data: IEntity = await API.GET(`meta/entity/${params.key}`);

            setEntityMeta(data);
        })();
    }, [params.key]);

    if (!entityMeta) return null;

    return entityMeta.type === ENTITY_TYPE.SINGLE ? (
        <SingleEntity entity={entityMeta}></SingleEntity>
    ) : (
        <CollectionEntity entityKey={entityMeta.key}></CollectionEntity>
    );
}
