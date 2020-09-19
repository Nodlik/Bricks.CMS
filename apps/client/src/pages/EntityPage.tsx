import CollectionEntity from '../components/Entity/CollectionEntity';
import { ENTITY_TYPE } from '@libs/types/IConfigTypes';
import { IEntity } from '@libs/types/IBricksDocument';
import React from 'react';
import SingleEntity from '../components/Entity/SingleEntity';
import { useFetchRequest } from '@client/hooks/fetch';
import { useParams } from 'react-router-dom';

interface EnitityKeyRoute {
    key: string;
}

export default function EntityPage(): JSX.Element | null {
    const params: EnitityKeyRoute = useParams();
    const entityMeta = useFetchRequest<IEntity>(`/meta/entity/${params.key}`);

    if (!entityMeta) {
        return null;
    }

    return entityMeta.type === ENTITY_TYPE.SINGLE ? (
        <SingleEntity entity={entityMeta}></SingleEntity>
    ) : (
        <CollectionEntity entityKey={entityMeta.key}></CollectionEntity>
    );
}
