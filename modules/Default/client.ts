import { ModuleExportTemplates, FieldFunctionComponent } from '@libs/BricksTemplate';

import SingleView from './Templates/Entity/SingleView';
import CollectionView from './Templates/Entity/CollectionView';

import { ParagraphString, TextInput, Textarea, MarkdownEditor } from './Templates/Fields/SingleFields';
import { ENTITY_TYPE } from '@libs/types/IConfigTypes';
import { ImageField, ImageBlock } from './Templates/Fields/ImageField';

class DefaultModuleClient {
    public static MODULE_NAME: string = 'default';
    private static fields = new Map<string, FieldFunctionComponent>();

    public static templates(): ModuleExportTemplates {
        this.setTemplate(ENTITY_TYPE.SINGLE, 'string', TextInput);
        this.setTemplate(ENTITY_TYPE.SINGLE, 'markdown', MarkdownEditor);
        this.setTemplate(ENTITY_TYPE.SINGLE, 'image', ImageField);

        this.setTemplate(ENTITY_TYPE.COLLECTION, 'string', ParagraphString);
        this.setTemplate(ENTITY_TYPE.COLLECTION, 'markdown', ParagraphString);
        this.setTemplate(ENTITY_TYPE.COLLECTION, 'image', ImageBlock);

        return {
            single: SingleView,
            collection: CollectionView,
            fields: this.fields,
        };
    }

    private static setTemplate(
        entityType: ENTITY_TYPE,
        fieldType: string,
        Component: FieldFunctionComponent
    ) {
        this.fields.set(`${entityType}_${fieldType}`, Component);
    }
}

export default DefaultModuleClient;
