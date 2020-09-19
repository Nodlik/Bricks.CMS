import * as API from '../../utils/API';

import { IBricksDocument, IEntity } from '@libs/types/IBricksDocument';
import React, { useEffect, useState } from 'react';

import { Redirect } from 'react-router-dom';

interface IEntityMetaProps {
    entity: IEntity;
}

export default function SingleEntity(props: IEntityMetaProps): JSX.Element | null {
    const [response, setResponse] = useState<IBricksDocument | null>();

    useEffect(() => {
        void (async () => {
            const data: IBricksDocument | null = await API.GET(
                `/entities/${props.entity.key}/first`
            );

            setResponse(data);
        })();
    }, [props.entity]);

    if (response === null) {
        return <Redirect to={`/entity/key/${props.entity.key}/new`} />;
    } else if (!response) {
        return null;
    }

    return <Redirect to={`/entity/key/${props.entity.key}/id/${response.id}`} />;
}
