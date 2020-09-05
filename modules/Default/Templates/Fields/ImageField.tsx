import React, { useCallback, useState, useEffect } from 'react';
import { IRenderFieldProps } from '@libs/BricksTemplate';
import { useDropzone } from 'react-dropzone';

export function ImageField(props: IRenderFieldProps) {
    const [image, setImage] = useState<HTMLImageElement>();

    const onDrop = useCallback((acceptedFiles) => {
        acceptedFiles.forEach((file: Blob) => {
            const reader = new FileReader();

            reader.onabort = () => console.log('file reading was aborted');
            reader.onerror = () => console.log('file reading has failed');
            reader.onload = () => {
                if (props.onChange) {
                    props.onChange(props.field.key, reader.result);
                }

                const image = new Image();
                image.src = reader.result as string;
                setImage(image);
            };
            reader.readAsDataURL(file);
        });
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        multiple: false,
        accept: 'image/jpeg, image/png',
    });

    useEffect(() => {
        const value = props.field.value;
        if (value?.thumbnail) {
            const image = new Image();
            image.src = process.env.REACT_STATICS_PATH + value.thumbnail;
            setImage(image);
        }
    }, []);

    return (
        <div className="formRow">
            <span className="formRowTitle">{props.field.displayName}:</span>
            <div {...getRootProps()} className="dropZone">
                <input {...getInputProps()} />
                <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
            {image && (
                <div className="imagePlace">
                    <img width="200" src={image.src} alt="" />
                </div>
            )}
        </div>
    );
}

export function ImageBlock(props: IRenderFieldProps) {
    return (
        <div className="imageRow">
            <b className="imageRowTitle">{props.field.displayName}:</b>
            <img
                width="200"
                src={`${process.env.REACT_STATICS_PATH}${props.field.value.thumbnail}`}
                alt=""
            />
        </div>
    );
}
