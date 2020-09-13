import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import { ContentState, EditorState, convertFromHTML, convertToRaw } from 'draft-js';
import React, { useState } from 'react';

import { Editor } from 'react-draft-wysiwyg';
import { FormInputWidget } from '@client/components/UI/Form';
import { IRenderFieldProps } from '@libs/BricksTemplate';
import draftToHtml from 'draftjs-to-html';
import useYupValidator from '@client/hooks/validation';

export function TextInput(props: IRenderFieldProps): JSX.Element {
    const field = props.field;

    const { errors, errorText, setValue } = useYupValidator(field);

    return (
        <FormInputWidget
            title={props.field.displayName}
            fieldName={props.field.key}
            fieldType="text"
            onChange={(old, val) => {
                setValue(val);
            }}
            value={props.field.value}
            readOnly={props.field.readonly}
            errors={errors}
            errorText={errorText}
            description={props.field.description}
        ></FormInputWidget>
        // <div className="formRow">
        //     <label>
        //         <span className="formRowTitle">{props.field.displayName}</span>: <br />
        //         <input
        //             type="text"
        //             readOnly={props.field.readonly}
        //             required={props.field.required}
        //             defaultValue={props.field.value}
        //             onChange={(e) => {
        //                 if (props.onChange) {
        //                     props.onChange(props.field.key, e.target.value);
        //                 }
        //             }}
        //         />
        //         <br />
        //         <span className="fieldDescription">{props.field.description}</span>
        //     </label>
        // </div>
    );
}

export function MarkdownEditor(props: IRenderFieldProps) {
    const [editorState, setEditorState] = useState(
        EditorState.createWithContent(
            ContentState.createFromBlockArray(
                convertFromHTML(props.field.value || '<p></p>').contentBlocks
            )
        )
    );

    return (
        <div className="formRow">
            <label>
                <span className="formRowTitle">{props.field.displayName}</span>: <br />
                <Editor
                    defaultEditorState={editorState}
                    editorClassName="markdown"
                    onEditorStateChange={setEditorState}
                    onChange={() => {
                        if (props.onChange) {
                            const rawContentState = convertToRaw(editorState.getCurrentContent());

                            const markup = draftToHtml(rawContentState);
                            props.onChange(props.field.key, markup);
                        }
                    }}
                >
                    {props.field.value}
                </Editor>
            </label>
        </div>
    );
}

export function Textarea(props: IRenderFieldProps) {
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

export function ParagraphString(props: IRenderFieldProps) {
    return <p>{props.field.value}</p>;
}
