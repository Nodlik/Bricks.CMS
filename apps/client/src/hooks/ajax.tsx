import { useEffect, useReducer, useState } from 'react';

import { APIError } from '@client/utils/APIError';
import ConsoleLogger from '@client/utils/ConsoleLogger';

export type AjaxSender = (response: Promise<any>) => any;

export type RequestHookError = {
    errorCode: number;
    errorText: string;
};

export const enum RequestStatus {
    NOT_SENT = 'not_sent',
    PENDING = 'pending',
    SUCCESS = 'success',
    ERROR = 'error',
}

interface AJAXRequestResult<T> {
    status: RequestStatus;
    response?: T;
    error?: RequestHookError;
    isError: boolean;
    isDone: boolean;
}

interface AJAXHookResult<T> {
    result: AJAXRequestResult<T>;
    send: React.Dispatch<React.SetStateAction<Promise<any> | undefined>>;
}

type ReduceAction<T> = {
    type: RequestStatus;
    data?: T;
    error?: RequestHookError;
};

const createRequestReducer = <T,>() => (
    state: AJAXRequestResult<T>,
    action: ReduceAction<T>
): AJAXRequestResult<T> => {
    switch (action.type) {
        case RequestStatus.NOT_SENT:
            return {
                ...state,
                status: RequestStatus.NOT_SENT,
                error: undefined,
                isError: false,
                isDone: false,
            };
        case RequestStatus.PENDING:
            return {
                ...state,
                status: RequestStatus.PENDING,
                error: undefined,
                isError: false,
                isDone: false,
            };
        case RequestStatus.ERROR:
            return {
                ...state,
                error: action.error,
                status: RequestStatus.ERROR,
                isError: true,
                isDone: true,
            };
        case RequestStatus.SUCCESS:
            return {
                response: action.data,
                status: RequestStatus.SUCCESS,
                error: undefined,
                isError: false,
                isDone: true,
            };
        default:
            ConsoleLogger.LogRed(`FRONT: Invalid request reducer state`);
            throw new Error();
    }
};

export default function useAJAX<T>(): AJAXHookResult<T> {
    const [request, setRequest] = useState<Promise<any>>();

    const requestReducer = createRequestReducer<T>();
    const [state, dispatch] = useReducer(requestReducer, {
        status: RequestStatus.NOT_SENT,
        response: undefined,
        error: undefined,
        isError: false,
        isDone: false,
    });

    useEffect(() => {
        if (!request) {
            return;
        }

        dispatch({ type: RequestStatus.PENDING });

        void (async () => {
            try {
                const result = await request;

                dispatch({ type: RequestStatus.SUCCESS, data: result });
            } catch (e) {
                const currentError =
                    e instanceof APIError
                        ? {
                              errorCode: e.getCode(),
                              errorText: e.message,
                          }
                        : {
                              errorCode: 0,
                              errorText: 'Unhandled error',
                          };

                dispatch({ type: RequestStatus.ERROR, error: currentError });

                ConsoleLogger.LogRed(`CODE: ${currentError.errorCode}. ${currentError.errorText}`);
            }
        })();
    }, [request]);

    return {
        result: state,
        send: setRequest,
    };
}
