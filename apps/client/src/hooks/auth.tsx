import { AuthContext } from '../context/AuthContextProvider';
import { JWTData } from '@libs/types/AppTypes';
import { useContext } from 'react';

export type AuthState = [boolean, JWTData | null];

export default function useAuth(): AuthState {
    const { state } = useContext(AuthContext);

    return [state.isAuth, state.data];
}
