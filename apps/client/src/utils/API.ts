/* eslint-disable @typescript-eslint/no-unsafe-return */
import { APIError } from './APIError';

export const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:9000';

export const enum REQUEST_METHOD {
    POST = 'POST',
    GET = 'GET',
    PUT = 'PUT',
    PATCH = 'PATCH',
}

export const enum REQUEST_RESULT {
    SUCCESS = 'SUCCESS',
    API_ERROR = 'API_ERROR',
    SERVER_ERROR = 'SERVER_ERROR',
}

export type RequestResult = {
    response: Response;
    url: string;
    paramsString: string;
    headers: Record<string, string>;
};

export type ApiRequestResult = {
    result: REQUEST_RESULT;
    data: unknown;
    errorText: string;
    errorCode: number;
    status: number;
};

export async function Request(
    url: string,
    params: Record<string, unknown>,
    method: REQUEST_METHOD,
    headers: Record<string, string> = {}
): Promise<RequestResult> {
    const paramsString =
        method === REQUEST_METHOD.GET
            ? '?' +
              String(
                  Object.entries(params)
                      .map(
                          ([key, val]) =>
                              `${encodeURIComponent(key)}=${encodeURIComponent(String(val))}`
                      )
                      .join('&')
              )
            : '';

    const requestHeaders = Object.assign(
        headers,
        method === REQUEST_METHOD.GET
            ? {}
            : {
                  'Content-Type': 'application/json;charset=utf-8',
              }
    );

    type wtfTS = 'include'; // not good fix for TS error in fetch request "string is not "include" .... "

    const credentials: wtfTS = 'include';

    const requestData = {
        method,
        headers: requestHeaders,
        credentials,
    };

    method !== REQUEST_METHOD.GET && Object.assign(requestData, { body: JSON.stringify(params) });

    const response = await fetch(SERVER_URL + url + paramsString, requestData);

    return {
        response: response,
        url: SERVER_URL + url + paramsString,
        paramsString,
        headers: requestHeaders,
    };
}

export async function SendAPIRequest(
    url: string,
    params: Record<string, unknown>,
    method: REQUEST_METHOD,
    headers: Record<string, string> = {}
): Promise<ApiRequestResult> {
    const req = await Request(url, params, method, headers);

    if (!req.response.ok) {
        const data = await req.response.json();
        if ('code' in data) {
            return {
                result: REQUEST_RESULT.API_ERROR,
                data: data,
                errorText: data['text'],
                errorCode: parseInt(data['code']),
                status: req.response.status,
            };
        } else {
            return {
                result: REQUEST_RESULT.SERVER_ERROR,
                data: data,
                errorText: 'Unhandled error',
                errorCode: 0,
                status: req.response.status,
            };
        }
    }

    const data = await req.response.json();
    return {
        result: REQUEST_RESULT.SUCCESS,
        data: data,
        errorText: '',
        errorCode: -1,
        status: req.response.status,
    };
}

export async function Send(
    url: string,
    params: Record<string, unknown>,
    method: REQUEST_METHOD
): Promise<any> {
    const response = await SendAPIRequest(url, params, method);
    if (response.result === REQUEST_RESULT.SUCCESS) {
        return response.data;
    }

    throw new APIError({ code: response.errorCode, text: response.errorText });
}

export async function GET(url: string, params: Record<string, string> = {}): Promise<any> {
    return await Send(url, params, REQUEST_METHOD.GET);
}

export async function PUT(url: string, data: Record<string, unknown> = {}): Promise<any> {
    return await Send(url, data, REQUEST_METHOD.PUT);
}

export async function PATCH(url: string, data: Record<string, unknown> = {}): Promise<any> {
    return await Send(url, data, REQUEST_METHOD.PATCH);
}

export async function POST(url: string, data: Record<string, unknown> = {}): Promise<any> {
    return await Send(url, data, REQUEST_METHOD.POST);
}
