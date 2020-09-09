import * as API from '../utils/API';

import React, { useEffect, useState } from 'react';

import CollectionEntity from '../components/Entity/CollectionEntity';
import { ENTITY_TYPE } from '@libs/types/IConfigTypes';
import { IEntity } from '@libs/types/IBricksDocument';
import SingleEntity from '../components/Entity/SingleEntity';
import { useParams } from 'react-router-dom';

interface EnitityKeyRoute {
    key: string;
}

export default function EntityPage(): JSX.Element | null {
    const [entityMeta, setEntityMeta] = useState<IEntity>();
    const params: EnitityKeyRoute = useParams();

    useEffect(() => {
        void (async () => {
            const data: IEntity = await API.GET(`/meta/entity/${params.key}`);

            setEntityMeta(data);
        })();
    }, [params.key]);

    if (!entityMeta) {
        return null;
    }

    return entityMeta.type === ENTITY_TYPE.SINGLE ? (
        <SingleEntity entity={entityMeta}></SingleEntity>
    ) : (
        <CollectionEntity entityKey={entityMeta.key}></CollectionEntity>
    );
}
