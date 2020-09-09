import React, { ReactNode, useState } from 'react';

import { JWTData } from '@libs/types/AppTypes';

export interface ClientAuthData {
    isAuth: boolean;
    data: JWTData | null;
}

export const AuthContext = React.createContext<{
    authState: ClientAuthData;
    setAuthState: React.Dispatch<any>;
}>({
    authState: {
        isAuth: false,
        data: null,
    },
    setAuthState: () => null,
});

interface AuthContextProviderProps {
    children: ReactNode;
}

export const AuthContextProvider = (props: AuthContextProviderProps): JSX.Element => {
    const [authState, setAuthState] = useState<ClientAuthData>({
        isAuth: false,
        data: null,
    });

    return (
        <AuthContext.Provider value={{ authState, setAuthState }}>
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;
