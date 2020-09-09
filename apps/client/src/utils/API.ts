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
    data: Record<string, string>;
    errorText: string;
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

    const requestData = {
        method,
        headers: requestHeaders,
    };

    method !== REQUEST_METHOD.GET && Object.assign(requestData, { body: JSON.stringify(params) });

    const response = await fetch(SERVER_URL + url + paramsString, requestData);

    return {
        response,
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
): Promise<Request> {
    try {
        const req = await Request(
            url,
            params,
            method,
            Object.assign(headers, { credentials: 'include' })
        );

        // req.response.
    }
}

export async function GET(url: string, params: Record<string, string> = {}): Promise<any> {
    //Promise<Record<string, unknown>> {
    const paramsString = Object.entries(params)
        .map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`)
        .join('&');

    const req = await fetch(SERVER_URL + url + paramsString, {
        method: 'GET',
        credentials: 'include',
    });

    if (!req.ok) {
        throw new Error(await req.json());
    }

    return (await req.json()) as Record<string, unknown>;
}

export async function PUT(entity: string, data: object = {}) {
    const req = await fetch(process.env.REACT_APP_SERVER_URL + '/' + entity, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(data),
    });

    if (!req.ok) {
        throw new Error(await req.json());
    }

    return await req.json();
}

export async function PATCH(entity: string, data: object = {}) {
    const req = await fetch(process.env.REACT_APP_SERVER_URL + '/' + entity, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(data),
    });

    if (!req.ok) {
        throw new Error(await req.json());
    }

    return await req.json();
}

export async function POST(entity: string, data: object = {}) {
    const req = await fetch(process.env.REACT_APP_SERVER_URL + '/' + entity, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        },
        credentials: 'include',
        body: JSON.stringify(data),
    });

    if (!req.ok) {
        throw new Error(await req.json());
    }

    return await req.json();
}
