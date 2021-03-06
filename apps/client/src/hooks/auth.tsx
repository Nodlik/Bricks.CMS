import { AuthContext } from '../context/AuthContextProvider';
import { JWTData } from '@libs/types/AppTypes';
import { useContext } from 'react';

export type AuthState = {
    isAuth: boolean;
    user: JWTData | null;
    token: string;
    setAuthState: React.Dispatch<any>;
};

export default function useAuth(): AuthState {
    const { authState, setAuthState } = useContext(AuthContext);

    return {
        isAuth: authState.isAuth,
        token: authState.token,
        user: authState.data,
        setAuthState: setAuthState,
    };
}
