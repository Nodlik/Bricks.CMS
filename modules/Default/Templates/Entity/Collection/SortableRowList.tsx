import * as API from '@client/utils/API';

import React, { useEffect, useState } from 'react';
import { RowList, RowListProps } from './RowList';
import useAJAX, { RequestStatus } from '@client/hooks/ajax';

import { IBricksCollection } from '@libs/types/IBricksDocument';
import { SortableContainer } from 'react-sortable-hoc';
import { arrayMoveMutate } from '@libs/utils/ArrayMove';

interface ISortState {
    oldIndex: any;
    newIndex: any;
    nodes: any;
}

const SortableHOCList = SortableContainer((props: RowListProps) => <RowList {...props} />);

export function SortableRowList(props: RowListProps): JSX.Element {
    const [collection, setCollection] = useState<IBricksCollection>(props.collection);

    const move = useAJAX();

    useEffect(() => {
        setCollection(props.collection);
    }, [props]);

    const sortStart = () => {
        // setDraggable(true);
    };

    const sortEnd = (sortState: ISortState) => {
        if (sortState.oldIndex === sortState.newIndex) {
            return;
        }

        const movedRow = String(sortState.nodes[sortState.oldIndex].node.dataset['id']);
        const targetRow = String(sortState.nodes[sortState.newIndex].node.dataset['id']);

        arrayMoveMutate(collection.documents, sortState.oldIndex, sortState.newIndex);

        move.send(
            API.PATCH(`/entities/move/${props.collection.entity.key}/${movedRow}/${targetRow}`)
        );
    };

    return (
        <SortableHOCList
            useDragHandle
            disabled={move.result.status === RequestStatus.PENDING}
            templates={props.templates}
            collection={collection}
            onSelect={props.onSelect}
            onSortEnd={sortEnd}
            onSortStart={sortStart}
            className={move.result.status === RequestStatus.PENDING ? '--disabled' : undefined}
        ></SortableHOCList>
    );
}
