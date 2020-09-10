import * as API from '../utils/API';

/* eslint-disable @typescript-eslint/unbound-method */
import React, { useContext, useEffect, useState } from 'react';
import useAJAX, { RequestStatus } from '@client/hooks/ajax';

import { AuthContext } from '@client/context/AuthContextProvider';
import { FormWidget } from '@client/components/UI/Form';
import Logo from '@client/components/UI/Logo';
import jwt_decode from 'jwt-decode';
import { useForm } from 'react-hook-form';

type Inputs = {
    login: string;
    password: string;
};

export default function LoginPage(): JSX.Element {
    const { setAuthState } = useContext(AuthContext);
    const [error, setError] = useState<string>('');
    const [requestStatus, setRequestStatus] = useState<RequestStatus>(RequestStatus.NOT_SENT);

    const { register, handleSubmit, errors } = useForm<Inputs>();
    const ajax = useAJAX();

    const onSubmit = async (data: any) => {
        const response = await ajax.send(API.POST('/user/login', data));

        if (response) {
            setAuthState({
                isAuth: true,
                data: jwt_decode(response.token),
            });
        }
    };

    useEffect(() => {
        setError(ajax.error?.errorText || '');
    }, [ajax.error]);

    useEffect(() => {
        setRequestStatus(ajax.status);
    }, [ajax.status]);

    return (
        <div className="loginPage">
            <Logo />
            <div className="loginPage__content">
                <h1 className="pageHeader">SIGN IN</h1>
                <form method="POST" onSubmit={handleSubmit(onSubmit)} className="formBlock">
                    <div className="formBlock__row">
                        <FormWidget
                            title="Login"
                            fieldName="login"
                            fieldType="text"
                            errors={errors}
                            errorText="Enter login"
                            validateRef={register({ required: true })}
                        ></FormWidget>
                    </div>
                    <div className="formBlock__row">
                        <FormWidget
                            title="Password"
                            fieldName="password"
                            fieldType="password"
                            errors={errors}
                            errorText="Enter password"
                            validateRef={register({ required: true })}
                        ></FormWidget>
                    </div>
                    <div className="divider"></div>

                    <div className="alertBox">
                        {error && <div className="alert --error">{error}</div>}
                    </div>

                    <div className="formBlock__row">
                        <input
                            type="submit"
                            className={
                                'button ' +
                                (requestStatus === RequestStatus.PENDING ? '--pending' : '')
                            }
                            value="Sign in"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}
