import React, { ReactNode, useState } from 'react';

import { JWTData } from '@libs/types/AppTypes';

export interface ClientAuthData {
    isAuth: boolean;
    data: JWTData | null;
}

export const AuthContext = React.createContext<{
    state: ClientAuthData;
    setState: React.Dispatch<any>;
}>({
    state: {
        isAuth: false,
        data: null,
    },
    setState: () => null,
});

interface AuthContextProviderProps {
    children: ReactNode;
}

export const AuthContextProvider = (props: AuthContextProviderProps): JSX.Element => {
    const [state, setState] = useState<ClientAuthData>({
        isAuth: false,
        data: null,
    });

    return (
        <AuthContext.Provider value={{ state, setState }}>{props.children}</AuthContext.Provider>
    );
};

export default AuthContextProvider;
