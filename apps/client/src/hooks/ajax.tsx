/* eslint-disable @typescript-eslint/no-unsafe-return */
import { APIError } from '@client/utils/APIError';
import ConsoleLogger from '@client/utils/ConsoleLogger';
import { useState } from 'react';

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

export type RequestHook = {
    status: RequestStatus;
    send: AjaxSender;
    response: any;
    error?: RequestHookError;
    isError: boolean;
};

export default function useAJAX(): RequestHook {
    const [response, setResponse] = useState<any>();
    const [error, setError] = useState<RequestHookError | undefined>();
    const [isError, setIsError] = useState<boolean>(false);
    const [status, setStatus] = useState<RequestStatus>(RequestStatus.NOT_SENT);

    const sender = async (response: Promise<any>) => {
        setStatus(RequestStatus.PENDING);

        try {
            const result = await response;
            setResponse(result);
            setIsError(false);
            setError(undefined);

            setStatus(RequestStatus.SUCCESS);

            return result;
        } catch (e) {
            setIsError(true);

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

            setError(currentError);
            setStatus(RequestStatus.ERROR);

            ConsoleLogger.LogRed(`CODE: ${currentError.errorCode}. ${currentError.errorText}`);
        }
    };

    return {
        status,
        send: sender,
        response,
        error,
        isError,
    };
}
