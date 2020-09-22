type ErrorDescription = [number, string];
type ErrorList = {
    [index: number]: ErrorDescription;
};

export const enum ERROR_CODE {
    CSRF_INVALID = 10,
    UNAUTH_ONLY = 11,
    INVALID_EFFECT = 12,

    AUTH_REQUIRED = 1000,
    WRONG_PASSWORD = 1001,

    VALIDATE_REQUEST_ERROR = 1100,
    VALIDATE_ENTITY_ERROR = 1101,
    ENTITY_NOT_EXIST = 1102,
    DOCUMENT_NOT_EXIST = 1103,
}

export const ERROR_LIST: ErrorList = {
    10: [403, 'CSRF token required or not valid'],
    11: [403, 'Action for unauthorized users only'],
    12: [500, 'No such effect for this entity'],

    1000: [403, 'Authorization required'],
    1001: [401, 'Wrong password or login'],

    1100: [400, 'Parameters entered incorrectly'],
    1101: [422, 'Entity data validation error'],
    1102: [404, 'Entity does not exist'],
    1103: [404, 'Document does not exist'],
};
