import * as API from '../utils/API';

/* eslint-disable @typescript-eslint/unbound-method */
import React, { useEffect } from 'react';

import { useForm } from 'react-hook-form';

type Inputs = {
    login: string;
    password: string;
};

export default function LoginPage(): JSX.Element {
    const { register, handleSubmit, errors } = useForm<Inputs>();

    const onSubmit = async (data: any) => {
        const result = await API.POST('user/login', data);
        console.log(result);
    };

    return (
        <div>
            <h1 className="pageHeader">LOGIN</h1>
            <div style={{ color: 'red' }}>
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
