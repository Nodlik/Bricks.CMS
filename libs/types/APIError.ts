export interface APIErrorData {
    code: number;
    statusCode: number;
    text: string;
}

export class APIError extends Error {
    protected data: APIErrorData;

    constructor(data: APIErrorData) {
        super(data.text);

        this.data = data;
    }

    public getCode(): number {
        return this.data.code;
    }

    public getStatusCode(): number {
        return this.data.statusCode;
    }
}

export class ServerError extends Error {
    protected code: number;

    constructor(code: number) {
        super('');

        this.code = code;
    }

    public getCode(): number {
        return this.code;
    }
}
