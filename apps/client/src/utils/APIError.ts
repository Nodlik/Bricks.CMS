export interface APIErrorData {
    code: number;
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
}
