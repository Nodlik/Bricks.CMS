/* eslint-disable @typescript-eslint/no-implied-eval */
import * as yup from 'yup';

import { useEffect, useMemo, useState } from 'react';

import { FieldErrors } from 'react-hook-form';
import { IField } from '@libs/types/IBricksDocument';
import { MongooseToYup } from '@libs/utils/MongoseToYup/MongoseToYup';

export type YupResult = {
    errors?: FieldErrors<any>;
    errorText?: string;
    setValue: React.Dispatch<React.SetStateAction<unknown>>;
};

export default function useYupValidator(field: IField): YupResult {
    const [value, setValue] = useState();

    const [errorText, setErrorText] = useState<string>('');
    const [errors, setErrors] = useState<FieldErrors>([]);

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
                for (const custom of field.validators.custom) {
                    const validatorFn = new Function('return ' + custom.validatorFn);
                    const messageFn = new Function('return ' + custom.messageFn);
                    schema = converter.addYupCustomMethod(
                        schema,
                        'custom',
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

                setErrorText('');
                setErrors({});
            } catch (e) {
                if (e instanceof yup.ValidationError) {
                    setErrorText(e.message);
                    const err: Record<string, unknown> = {};
                    err[field.key] = e.message;
                    setErrors(err);
                }
            }
        })();
    }, [value, validator, field]);

    return {
        errors: errors,
        errorText: errorText,
        setValue,
    };
}
