import { ImageOptions } from '../init';

import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';
import mkdirp from 'mkdirp';

interface ImageSizes {
    [index: string]: string;
}

interface ImageLoadingResult {
    name: string;
    thumbnail: string;
    sizes?: ImageSizes;
    original?: string;
}

export class ImageLoader {
    private imageData: Buffer;

    public constructor(imageData: string, private options: ImageOptions) {
        this.imageData = Buffer.from(imageData.split(';base64,').pop()!, 'base64');
    }

    public async load(): Promise<ImageLoadingResult> {
        // todo ПЕРЕПИСТЬ!!!!!
        const fileName = crypto
            .createHash('md5')
            .update(this.imageData)
            .digest('base64')
            .replace('/', '') 
            .replace('=', '')
            .replace('\\', '');

        try {
            const uploadDir = `apps/client/public/uploads/${fileName}`;
            await mkdirp(uploadDir);

            const name = `${uploadDir}/${fileName}_thumbnail.jpg`;
            await sharp(this.imageData)
                .resize(250, 250)
                .toFormat('jpeg')
                .jpeg({ quality: 90 })
                .toFile(path.resolve('', name));

            let result: ImageLoadingResult = {
                name: fileName,
                thumbnail: `/uploads/${fileName}/${fileName}_thumbnail.jpg`,
            };

            if (this.options.sizes) {
                let resultSizes: ImageSizes = {};

                for (const sizes of this.options.sizes) {
                    const name = `${uploadDir}/${fileName}_${sizes[0]}-${sizes[1]}.jpg`;
                    await sharp(this.imageData)
                        .resize(sizes[0], sizes[1], {
                            fit: this.options.methods || 'contain',
                            position: this.options.position || 'centre',
                        })
                        .toFormat('jpeg')
                        .jpeg({ quality: 90 })
                        .toFile(path.resolve('', name));

                    resultSizes[
                        `${sizes[0]}-${sizes[1]}`
                    ] = `/uploads/${fileName}/${fileName}_${sizes[0]}-${sizes[1]}.jpg`;
                }

                result.sizes = resultSizes;
            }

            if (this.options.saveOriginal || !this.options.sizes) {
                const name = `${uploadDir}/${fileName}_original.jpg`;
                await sharp(this.imageData)
                    .toFormat('jpeg')
                    .jpeg({ quality: 90 })
                    .toFile(path.resolve('', name));

                result.original = `/uploads/${fileName}/${fileName}_original.jpg`;
            }

            return result;
        } catch (e) {
            console.log(e);
            throw new Error(e);
        }
    }
}
