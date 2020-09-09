type ErrorDescription = [number, string];
type ErrorList = {
    [index: number]: ErrorDescription;
};

export const enum ERROR_CODE {
    AUTH_REQUIRED = 1000,
    WRONG_PASSWORD = 1001,
}

export const ERROR_LIST: ErrorList = {
    1000: [403, 'Authorization required'],
    1001: [401, 'Wrong password or login'],
};
