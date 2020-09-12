import * as API from '../utils/API';

import React, { useContext, useEffect } from 'react';
import useAJAX, { RequestStatus } from '@client/hooks/ajax';

import { AuthContext } from '@client/context/AuthContextProvider';
import { Button } from '@client/components/UI/Button';
import { ButtonState } from '@client/components/UI/Button/Button';
import { FormInputWidget } from '@client/components/UI/Form';
import { Logo } from '@client/components/UI/Logo';
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

    // eslint-disable-next-line @typescript-eslint/unbound-method
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
                        <FormInputWidget
                            title="Login"
                            fieldName="login"
                            fieldType="text"
                            errors={errors}
                            errorText="Enter login"
                            validateRef={register({ required: true })}
                        ></FormInputWidget>
                    </div>
                    <div className="formBlock__row">
                        <FormInputWidget
                            title="Password"
                            fieldName="password"
                            fieldType="password"
                            errors={errors}
                            errorText="Enter password"
                            validateRef={register({ required: true })}
                        ></FormInputWidget>
                    </div>
                    <div className="divider"></div>

                    <div className="alertBox">
                        {result.isError && (
                            <div className="alert --error">{result.error?.errorText}</div>
                        )}
                    </div>

                    <div className="formBlock__row">
                        <Button
                            type="submit"
                            state={
                                result.status === RequestStatus.PENDING
                                    ? ButtonState.PENDING
                                    : ButtonState.ACTIVE
                            }
                            title="Sign in"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}
