/* eslint-disable @typescript-eslint/no-unsafe-return */
import * as yup from 'yup';

type ValidatorParameterValue = string | number | boolean | undefined;

type RuleConverter = (object: yup.Schema<unknown>, value: ValidatorValue) => yup.Schema<unknown>;
type TypeConverter = () => yup.Schema<unknown>;
type CustomValidateMethod = (value: unknown) => boolean;

type ValidatorValue = {
    value: ValidatorParameterValue[] | ValidatorParameterValue;
    errorText: string;
};

type ErrorMessageFn = (props: Record<string, unknown>) => string;

export class MongooseToYup {
    private typeConverters: Map<string, TypeConverter> = new Map();
    private validateConverters: Map<string, RuleConverter> = new Map();

    public constructor() {
        this.typeConverters.set('String', () => yup.string());
        this.typeConverters.set('Number', () => yup.number());
        this.typeConverters.set('Date', () => yup.number());

        this.validateConverters.set('minlength', (object: any, value: ValidatorValue) => {
            return object.min(value.value, value.errorText);
        });

        this.validateConverters.set('maxlength', (object: any, value: ValidatorValue) => {
            return object.max(value.value, value.errorText);
        });

        this.validateConverters.set('min', (object: any, value: ValidatorValue) => {
            return object.min(value.value, value.errorText);
        });

        this.validateConverters.set('max', (object: any, value: ValidatorValue) => {
            return object.max(value.value, value.errorText);
        });
    }

    private parseValue(ruleValue: any): ValidatorValue | null {
        const result = {
            value: undefined,
            errorText: '',
        };

        if (Array.isArray(ruleValue)) {
            if (ruleValue.length > 0) {
                result.value = ruleValue[0];

                if (ruleValue.length > 1) {
                    result.errorText = ruleValue[1];
                }
            }
        } else if (typeof ruleValue === 'object') {
            if ('values' in ruleValue) {
                result.value = ruleValue['values'];

                if ('message' in ruleValue) {
                    result.errorText = ruleValue['message'];
                }
            }
        } else {
            result.value = ruleValue;
        }

        if (result.value === undefined) {
            return null;
        }

        return result;
    }

    public getYupSchema(type: string): yup.Schema<unknown> | null {
        if (!this.typeConverters.has(type)) {
            return null;
        }

        return this.typeConverters.get(type)!();
    }

    public addYupCustomMethod(
        yupSchema: yup.Schema<unknown>,
        methodName: string,
        customMethod: CustomValidateMethod,
        errorMessage: string | ErrorMessageFn
    ): yup.Schema<unknown> {
        // const text = (typeof errorMessage === 'string') ? errorMessage : errorMessage();
        return (yupSchema as yup.MixedSchema<unknown>).test(methodName, errorMessage, customMethod);
    }

    public addYupMethod(
        yupSchema: yup.Schema<unknown>,
        ruleName: string,
        ruleValue: unknown
    ): yup.Schema<unknown> | null {
        if (!this.validateConverters.has(ruleName)) {
            return null;
        }

        const value = this.parseValue(ruleValue);
        if (value === null) {
            return null;
        }

        return this.validateConverters.get(ruleName)!(yupSchema, value);
    }

    public addRequeredMethod(
        yupSchema: yup.Schema<unknown>,
        message = 'Field value is required'
    ): yup.Schema<unknown> {
        return (yupSchema as yup.MixedSchema<unknown>).required(message);
    }
}
