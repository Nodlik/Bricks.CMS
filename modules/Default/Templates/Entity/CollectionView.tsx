import '../styles/default.scss';

import * as API from '@client/utils/API';

import { IBricksCollection, IBricksDocument } from '@libs/types/IBricksDocument';
import React, { useState } from 'react';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';

import { BricksTemplateSingleton } from '@libs/BricksTemplate';
import { ENTITY_TYPE } from '@libs/types/IConfigTypes';
import { IRenderCollectionProps } from '@libs/BricksTemplate';
import { Link } from 'react-router-dom';

interface RowProps {
    document: IBricksDocument;
    templates: BricksTemplateSingleton;
    sortIndex: any;
    index: any;
}

const DragHandle = SortableHandle(() => <div className="dragHandle"></div>);

const Row = (props: RowProps) => {
    const FieldsRender = props.document.fields.map((field, i) => {
        if (
            field.view.includes(ENTITY_TYPE.COLLECTION) &&
            field.key !== props.document.titleField
        ) {
            const Element = props.templates.getFieldTemplate(
                ENTITY_TYPE.COLLECTION,
                field.type,
                field.template
            );
            return <Element key={i} field={field}></Element>;
        }
        return null;
    });

    return (
        <div className="collectionRow" data-id={props.document.id}>
            <DragHandle />
            <Link to={`/entity/key/${props.document.key}/id/${props.document.id}`}>
                {props.document.fields.filter((_) => _.key === props.document.titleField)[0].value}
            </Link>
            {FieldsRender}
        </div>
    );
};

const SortableRow = SortableElement((props: RowProps) => <Row {...props} />);

const RowList = (props: IRenderCollectionProps) => {
    return (
        <ul>
            {props.collection.documents.map((_, i) => {
                return props.collection.entity.effects.sortable ? (
                    <SortableRow
                        document={_}
                        index={i}
                        sortIndex={i}
                        templates={props.templates}
                        key={i}
                    />
                ) : (
                    <Row document={_} index={i} sortIndex={i} templates={props.templates} key={i} />
                );
            })}
        </ul>
    );
};

const SortableRowList = SortableContainer((props: IRenderCollectionProps) => (
    <RowList {...props} />
));

interface ISortState {
    oldIndex: any;
    newIndex: any;
    nodes: any;
}

export default function CollectionView(props: IRenderCollectionProps): JSX.Element {
    const [collection, setCollection] = useState<IBricksCollection>(props.collection);

    const sortEnd = async (sortState: ISortState) => {
        if (sortState.oldIndex === sortState.newIndex) {
            return;
        }

        const movedRow = String(sortState.nodes[sortState.oldIndex].node.dataset['id']);
        const targetRow = String(sortState.nodes[sortState.newIndex].node.dataset['id']);

        await API.PATCH(`entities/move/${props.collection.entity.key}/${movedRow}/${targetRow}`);

        const data: IBricksCollection = await API.GET(`entities/${props.collection.entity.key}`);
        setCollection(data);
    };

    const rowList = props.collection.entity.effects.sortable ? (
        <SortableRowList
            useDragHandle
            templates={props.templates}
            collection={collection}
            onSortEnd={sortEnd}
        />
    ) : (
        <RowList {...props} />
    );

    return (
        <div>
            <div className="collectionTitle">
                <h4>Item List:</h4>{' '}
                {props.collection.entity.effects.sortable && (
                    <i style={{ fontSize: '12px', color: '#555' }}>
                        Elements are sorted. They can be dragged
                    </i>
                )}
            </div>
            {rowList}
        </div>
    );
}
