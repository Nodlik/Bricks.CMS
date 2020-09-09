export type middlewareFunction = () => void;

export interface JWTData {
    id: string;
    name: string;
    login: string;
}
