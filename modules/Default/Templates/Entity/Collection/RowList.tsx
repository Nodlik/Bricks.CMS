import React, { useState } from 'react';
import { Row, SortableRow } from './Rows';

import { IBricksDocument } from '@libs/types/IBricksDocument';
import { IRenderCollectionProps } from '@libs/BricksTemplate';

export interface RowListProps extends IRenderCollectionProps {
    onSelect?: (docs: Set<IBricksDocument>) => void;
    disabled?: boolean;
    className?: string;
}

export function RowList(props: RowListProps): JSX.Element {
    const [selected] = useState<Set<IBricksDocument>>(new Set());

    const onSelect = (doc: IBricksDocument) => {
        selected.add(doc);

        if (props.onSelect) {
            props.onSelect(selected);
        }
    };

    const onDeselect = (doc: IBricksDocument) => {
        selected.delete(doc);

        if (props.onSelect) {
            props.onSelect(selected);
        }
    };

    return (
        <ul className={'collectionList ' + (props.className || '')}>
            {props.collection.documents.map((_, i) => {
                return props.collection.entity.effects.sortable ? (
                    <SortableRow
                        document={_}
                        index={i}
                        sortIndex={i}
                        templates={props.templates}
                        key={i}
                        disabled={props.disabled}
                        onSelect={onSelect}
                        onDeselect={onDeselect}
                    />
                ) : (
                    <Row
                        document={_}
                        index={i}
                        sortIndex={i}
                        templates={props.templates}
                        key={i}
                        onSelect={onSelect}
                        onDeselect={onDeselect}
                    />
                );
            })}
        </ul>
    );
}
