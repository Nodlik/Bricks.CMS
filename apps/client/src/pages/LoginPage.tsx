import * as API from '../utils/API';

/* eslint-disable @typescript-eslint/unbound-method */
import React, { useContext, useState } from 'react';

import { APIError } from '@client/utils/APIError';
import { AuthContext } from '@client/context/AuthContextProvider';
import jwt_decode from 'jwt-decode';
import { useForm } from 'react-hook-form';

type Inputs = {
    login: string;
    password: string;
};

export default function LoginPage(): JSX.Element {
    const { setState } = useContext(AuthContext);
    const [error, setError] = useState<string>('');

    const { register, handleSubmit, errors } = useForm<Inputs>();

    const onSubmit = async (data: any) => {
        setError('');
        try {
            const { token } = await API.POST('/user/login', data);

            setState({
                isAuth: true,
                data: jwt_decode(token),
            });

            console.log(token);
        } catch (e) {
            e instanceof APIError ? setError(e.message) : setError('Unhandled error');
        }
    };

    return (
        <div>
            <h1 className="pageHeader">LOGIN</h1>
            <div style={{ color: 'red' }}>
                {error && <span>{error}</span>}
                {(errors.login || errors.password) && <span>All field is required</span>}
            </div>
            <form method="POST" onSubmit={handleSubmit(onSubmit)}>
                <div className="fieldRow">
                    <div className="formRow">
                        <label>
                            <span className="formRowTitle">Login: </span>
                            <br />
                            <input
                                type="text"
                                name="login"
                                ref={register({ required: true })}
                            ></input>
                        </label>
                    </div>
                </div>
                <div className="fieldRow">
                    <div className="formRow">
                        <label>
                            <span className="formRowTitle">Password: </span>
                            <br />
                            <input
                                type="password"
                                name="password"
                                ref={register({ required: true })}
                            ></input>
                        </label>
                    </div>
                </div>
                <hr />
                <input type="submit" className="button" value="Send" />
            </form>
        </div>
    );
}
