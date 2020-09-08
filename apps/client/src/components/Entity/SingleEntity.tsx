import React, { useEffect, useState } from 'react';
import { IBricksDocument, IEntity } from '@libs/types/IBricksDocument';
import Entity from './Entity';
import * as API from '../../utils/API';
import { Redirect } from 'react-router-dom';

interface IEntityMetaProps {
    entity: IEntity;
}

export default function SingleEntity(props: IEntityMetaProps) {
    const [response, setResponse] = useState<IBricksDocument | null>();

    useEffect(() => {
        (async () => {
            const data: IBricksDocument | null = await API.GET(
                `entities/${props.entity.key}/first`
            );

            setResponse(data);
        })();
    }, [props.entity]);

    if (response === null) return <Redirect to={`/entity/key/${props.entity.key}/new`} />;
    else if (!response) return <div>LOADING....</div>;

    return <Redirect to={`/entity/key/${props.entity.key}/id/${response.id}`} />;
}
