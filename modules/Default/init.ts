import { Bricks } from '@libs/Bricks';
import { Field } from 'apps/server/src/Model/Unit/Field';
import { ImageLoader } from './libs/ImageLoader';

type ImageResizeMethod = 'contain' | 'fill' | 'cover';

export interface ImageOptions {
    sizes?: number[][];
    methods?: ImageResizeMethod;
    saveOriginal?: boolean;
    position?: string;
}

export function init(name: string, bricks: Bricks): void {
    bricks.registerType('string', 'String');
    bricks.registerType('text', 'String');
    bricks.registerType('html', 'String');
    bricks.registerType('image', 'Mixed');

    bricks.registerValueMiddleware('image', async (imageBase64: any, field: Field) => {
        const loader = new ImageLoader(imageBase64, field.getOptions());

        return await loader.load();
    });
}
