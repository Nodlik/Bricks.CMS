import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import * as yup from 'yup';

import { ContentState, EditorState, convertFromHTML, convertToRaw } from 'draft-js';
import React, { useCallback, useEffect, useState } from 'react';

import ConsoleLogger from '@client/utils/ConsoleLogger';
import { Editor } from 'react-draft-wysiwyg';
import { FormInputWidget } from '@client/components/UI/Form';
import { IRenderFieldProps } from '@libs/BricksTemplate';
import { MongooseToYup } from '@libs/utils/MongoseToYup/MongoseToYup';
import draftToHtml from 'draftjs-to-html';

export function TextInput(props: IRenderFieldProps): JSX.Element {
    const field = props.field;

    // const validator = useCallback(() => {
    //     const converter = new MongooseToYup();

    //     let schema = converter.getYupSchema(field.mongoType);
    //     if (schema) {
    //         for (const [rule, value] of Object.entries(field.validators)) {
    //             const method = converter.addYupMethod(schema, rule, value);
    //             if (method) {
    //                 schema = method;
    //             }
    //         }

    //         // const data: Record<string, yup.Schema<unknown>> = {};
    //         // data[field.key] = schema;

    //         return schema; //yup.object().shape(data);
    //     }

    //     return null;
    // }, [field]);

    // console.log(validator());

    return (
        <FormInputWidget
            title={props.field.displayName}
            fieldName={props.field.key}
            fieldType="text"
            onChange={async (e) => {
                // const v = validator();
                // try {
                //     const validateResult = await v?.validate(e.target.value);
                //     ConsoleLogger.LogGreen('good');
                // } catch (e) {
                //     if (e instanceof yup.ValidationError) {
                //         ConsoleLogger.LogRed(e.message);
                //     }
                // }
            }}
            // errors={errors}
            // errorText="Enter login"
            // validateRef={register({ required: true })}
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
