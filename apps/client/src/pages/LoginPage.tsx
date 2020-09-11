import * as API from '../utils/API';

/* eslint-disable @typescript-eslint/unbound-method */
import React, { useContext, useEffect } from 'react';
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

type LoginSuccessResult = {
    token: string;
};

export default function LoginPage(): JSX.Element {
    const { setAuthState } = useContext(AuthContext);

    const { register, handleSubmit, errors } = useForm<Inputs>();
    const { result, send } = useAJAX<LoginSuccessResult>();

    const onSubmit = (data: any) => {
        send(API.POST('/user/login', data));
    };

    useEffect(() => {
        if (result.status === RequestStatus.SUCCESS) {
            setAuthState({
                isAuth: true,
                data: jwt_decode(result.response!.token),
            });
        }
    }, [result.status, result.response, setAuthState]);

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
                        {result.isError && (
                            <div className="alert --error">{result.error?.errorText}</div>
                        )}
                    </div>

                    <div className="formBlock__row">
                        <input
                            type="submit"
                            className={
                                'button ' +
                                (result.status === RequestStatus.PENDING ? '--pending' : '')
                            }
                            value="Sign in"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}
