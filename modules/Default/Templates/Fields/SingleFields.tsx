import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import { ContentState, EditorState, convertFromHTML, convertToRaw } from 'draft-js';
import React, { useEffect, useState } from 'react';

import { Editor } from 'react-draft-wysiwyg';
import { FormInputWidget } from '@client/components/UI/Form';
import { IRenderFieldProps } from '@libs/BricksTemplate';
import draftToHtml from 'draftjs-to-html';
import useYupValidator from '@client/hooks/validation';

export function TextInput(props: IRenderFieldProps): JSX.Element {
    const { result, validate } = useYupValidator(props.field);

    useEffect(() => {
        if (props.onChange) {
            props.onChange(props.field.key, result.value, result.isValid);
        }
    }, [result.isValid, result.value, props]);

    return (
        <FormInputWidget
            title={props.field.displayName}
            fieldName={props.field.key}
            fieldType="text"
            onChange={(old, val) => {
                validate(val);
            }}
            value={props.field.value}
            readOnly={props.field.readonly}
            errors={result.errors}
            errorText={result.errorText}
            description={props.field.description}
        ></FormInputWidget>
    );
}

export function MarkdownEditor(props: IRenderFieldProps): JSX.Element {
    const { result, validate } = useYupValidator(props.field);

    const [editorState, setEditorState] = useState(
        EditorState.createWithContent(
            ContentState.createFromBlockArray(
                convertFromHTML(props.field.value || '<p></p>').contentBlocks
            )
        )
    );

    useEffect(() => {
        if (props.onChange) {
            props.onChange(props.field.key, result.value, result.isValid);
        }
    }, [result.isValid, result.value, props]);

    return (
        <div className={'formBlock__widget' + (result.errors ? ' --error' : '')}>
            <label>
                <span className="fbw__title">{props.field.displayName}</span>: <br />
                <Editor
                    defaultEditorState={editorState}
                    editorClassName="markdown"
                    onEditorStateChange={setEditorState}
                    onChange={() => {
                        if (props.onChange) {
                            const rawContentState = convertToRaw(editorState.getCurrentContent());

                            const markup = draftToHtml(rawContentState);

                            validate(markup !== '<p></p>' ? markup : '');
                        }
                    }}
                >
                    {props.field.value}
                </Editor>
            </label>
        </div>
    );
}

export function Textarea(props: IRenderFieldProps): JSX.Element {
    return (
        <div>
            <label>
                {props.field.displayName}: <br />
                <textarea
                    rows={6}
                    defaultValue={props.field.value}
                    readOnly={props.field.readonly}
                    onChange={(e) => {
                        if (props.onChange) {
                            props.onChange(props.field.key, e.target.value);
                        }
                    }}
                ></textarea>
            </label>
        </div>
    );
}

export function ParagraphString(props: IRenderFieldProps): JSX.Element {
    return <p>{props.field.value}</p>;
}
