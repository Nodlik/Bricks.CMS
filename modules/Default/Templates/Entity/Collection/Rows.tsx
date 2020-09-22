import { ENTITY_TYPE, VIEW_TYPE } from '@libs/types/IConfigTypes';
import React, { useRef, useState } from 'react';
import { SortableElement, SortableHandle } from 'react-sortable-hoc';

import { BricksTemplateSingleton } from '@libs/BricksTemplate';
import { Button } from '@client/components/UI/Button';
import { ButtonType } from '@client/components/UI/Button/Button';
import { GrDrag } from 'react-icons/gr';
import { IBricksDocument } from '@libs/types/IBricksDocument';
import { Link } from 'react-router-dom';
import { getDisplayTitle } from '@client/utils/document';

export type RowSelectEvent = (document: IBricksDocument) => void;

interface RowProps {
    document: IBricksDocument;
    templates: BricksTemplateSingleton;
    sortIndex: any;
    index: any;
    disabled?: boolean;
    isSortable?: boolean;
    onSelect?: RowSelectEvent;
    onDeselect?: RowSelectEvent;
}

const DragHandle = SortableHandle(() => (
    <div className="cl__dragHandle">
        <GrDrag />
    </div>
));

const Row = (props: RowProps): JSX.Element => {
    const [isSelected, setSelected] = useState(false);

    const rowClick = () => {
        setSelected(!isSelected);

        if (!isSelected && props.onSelect) {
            props.onSelect(props.document);
        }
        if (isSelected && props.onDeselect) {
            props.onDeselect(props.document);
        }
    };

    const FieldsRender = props.document.fields.map((field, i) => {
        if (field.view.includes(VIEW_TYPE.LIST) && field.key !== props.document.titleField) {
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
        <div className={'cl__row ' + (isSelected ? '--selected' : '')} data-id={props.document.id}>
            {props.isSortable && <DragHandle />}
            <div className="cl__row-content">
                <div className="cl__row-title" onClick={rowClick}>
                    <div className="cl__row-titleLeft">
                        <label>
                            <input type="checkbox" checked={isSelected} onChange={rowClick} />
                        </label>
                        <Link
                            to={`/entity/key/${props.document.key}/id/${props.document.id}`}
                            className="cl__row-title__link"
                        >
                            {getDisplayTitle(props.document)}
                        </Link>
                    </div>
                    <Button
                        title="remove"
                        buttonType={ButtonType.DANGER}
                        className="cl__row-title__delete"
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    ></Button>
                </div>
            </div>
            {FieldsRender}
        </div>
    );
};

const SortableRow = SortableElement((props: RowProps) => <Row {...props} isSortable={true} />);

export { Row, SortableRow };
