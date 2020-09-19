import { IBricksDocument } from '@libs/types/IBricksDocument';

export function getDisplayTitle(doc: IBricksDocument): string {
    for (const field of doc.fields) {
        if (field.key === doc.titleField) {
            return field.value as string;
        }
    }

    return '';
}
