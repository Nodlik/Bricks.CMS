import { ModuleExportTemplates } from '@libs/BricksTemplate';

import SingleView from './Entity/SingleView';
import CollectionView from './Entity/CollectionView';

import { ParagraphString, TextInput, MarkdownEditor } from './Fields/SingleFields';
import { ENTITY_TYPE } from '@libs/types/IConfigTypes';
import { ImageField, ImageBlock } from './Fields/ImageField';

export default function loader(): ModuleExportTemplates {
    return {
        single: SingleView,
        collection: CollectionView,
        fields: [
            [ENTITY_TYPE.SINGLE, 'string', TextInput],
            [ENTITY_TYPE.SINGLE, 'html', MarkdownEditor],
            [ENTITY_TYPE.SINGLE, 'image', ImageField],
            [ENTITY_TYPE.COLLECTION, 'html', ParagraphString],
            [ENTITY_TYPE.COLLECTION, 'image', ImageBlock],
        ],
    };
}
