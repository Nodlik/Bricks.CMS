import { useCallback, useRef, useState } from 'react';

export type EntityFieldsResult = {
    set: (newFields: Record<string, unknown> | undefined, newIsValid: boolean) => void;
    get: () => Record<string, unknown> | undefined;
    isValid: boolean;
};

export default function useEntityFields(): EntityFieldsResult {
    const [isValid, setIsValid] = useState<boolean>();
    const fields = useRef<Record<string, unknown>>();

    const set = useCallback(
        (newFields: Record<string, unknown> | undefined, newIsValid: boolean) => {
            fields.current = newIsValid ? newFields : undefined;
            setIsValid(newIsValid);
        },
        []
    );

    const get = useCallback(() => {
        return fields.current;
    }, []);

    return {
        get,
        set,
        isValid: isValid || false,
    };
}
