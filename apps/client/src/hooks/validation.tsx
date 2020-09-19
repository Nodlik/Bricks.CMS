/* eslint-disable @typescript-eslint/no-implied-eval */
import * as yup from 'yup';

import { useEffect, useMemo, useReducer, useState } from 'react';

import ConsoleLogger from '@client/utils/ConsoleLogger';
import { FieldErrors } from 'react-hook-form';
import { IField } from '@libs/types/IBricksDocument';
import { MongooseToYup } from '@libs/utils/MongoseToYup/MongoseToYup';

export type YupResult = {
    errors?: FieldErrors<any>;
    errorText?: string;
    isValid: boolean;
    value: unknown;
};

export type ValidateResult = {
    result: YupResult;
    validate: React.Dispatch<React.SetStateAction<unknown>>;
};

type ReduceAction = {
    type: 'init' | 'success' | 'error';
    value?: unknown;
    errors?: FieldErrors<any>;
    errorText?: string;
};

const validateReducer = (state: YupResult, action: ReduceAction): YupResult => {
    switch (action.type) {
        case 'init':
            return {
                ...state,
                errors: undefined,
                isValid: false,
            };
        case 'error':
            return {
                value: action.value,
                errors: action.errors,
                errorText: action.errorText,
                isValid: false,
            };
        case 'success':
            return {
                value: action.value,
                errors: undefined,
                errorText: '',
                isValid: true,
            };
        default:
            ConsoleLogger.LogRed(`FRONT: Invalid validate reducer state`);
            throw new Error();
    }
};

export default function useYupValidator(field: IField): ValidateResult {
    const [value, setValue] = useState();

    const [state, dispatch] = useReducer(validateReducer, {
        errors: undefined,
        errorText: '',
        isValid: !field.required,
        value: '',
    });

    const validator = useMemo(() => {
        const converter = new MongooseToYup();

        let schema = converter.getYupSchema(field.mongoType);
        if (schema) {
            for (const [rule, value] of Object.entries(field.validators)) {
                const schemaWithMethod = converter.addYupMethod(schema, rule, value);
                if (schemaWithMethod) {
                    schema = schemaWithMethod;
                }
            }

            if (field.validators.custom) {
                for (let i = 0; i < field.validators.custom.length; i++) {
                    const validatorFn = new Function(
                        'return ' + field.validators.custom[i].validatorFn
                    );
                    const messageFn = new Function(
                        'return ' + field.validators.custom[i].messageFn
                    );

                    schema = converter.addYupCustomMethod(
                        schema,
                        `custom_${i}`,
                        validatorFn(),
                        messageFn()
                    );
                }
            }

            if (field.required) {
                schema = converter.addRequeredMethod(schema);
            }

            return schema;
        }

        return null;
    }, [field]);

    useEffect(() => {
        if (value === undefined) {
            return;
        }

        void (async () => {
            try {
                await validator?.validate(value);

                dispatch({ type: 'success', value: value });
            } catch (e) {
                const message = e instanceof yup.ValidationError ? e.message : 'Unhandled error';

                const err: Record<string, unknown> = {};
                err[field.key] = message;

                dispatch({ type: 'error', errorText: message, errors: err, value: value });
            }
        })();
    }, [value, validator, field]);

    return {
        result: state,
        validate: setValue,
    };
}
