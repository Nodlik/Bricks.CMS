import '../styles/default.scss';

import React, { useEffect, useState } from 'react';

import { Button } from '@client/components/UI/Button';
import { ButtonType } from '@client/components/UI/Button/Button';
import { IBricksDocument } from '@libs/types/IBricksDocument';
import { IRenderCollectionProps } from '@libs/BricksTemplate';
import { RowList } from './Collection/RowList';
import { SortableRowList } from './Collection/SortableRowList';

export default function CollectionView(props: IRenderCollectionProps): JSX.Element {
    const [selected, setSelected] = useState<Set<IBricksDocument>>(new Set());
    // const [collection, setCollection] = useState<IBricksCollection>(props.collection);

    const onSelect = (docs: Set<IBricksDocument>) => {
        setSelected(new Set(docs));
    };

    const rowList = props.collection.entity.effects.sortable ? (
        <SortableRowList {...props} onSelect={onSelect} />
    ) : (
        <RowList {...props} onSelect={onSelect} />
    );

    return (
        <div className="collection">
            <div className="collectionHeader">
                <h4 className="collectionHeader__title">Item List:</h4>
                {props.collection.entity.effects.sortable && (
                    <i className="collectionHeader__subtext">
                        Elements are sorted. They can be dragged
                    </i>
                )}
            </div>
            {rowList}
            {selected?.size > 0 && (
                <div className="page__actions">
                    <div className="pa__text">Selected: {selected?.size}</div>
                    <Button
                        title="Remove"
                        onClick={() => {
                            //
                        }}
                        buttonType={ButtonType.DANGER}
                    ></Button>
                </div>
            )}
        </div>
    );
}
