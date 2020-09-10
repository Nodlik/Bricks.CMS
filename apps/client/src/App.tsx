import * as API from './utils/API';

import AuthContextProvider, { AuthContext } from './context/AuthContextProvider';
import React, { useContext, useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

import BricksTemplate from '@libs/BricksTemplate';
import ConsoleLogger from './utils/ConsoleLogger';
import EditEntityPage from './pages/EditEntityPage';
import EntityPage from './pages/EntityPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NewEntityPage from './pages/NewPage';
import Sidebar from './components/Sidebar';
import useAuth from './hooks/auth';

export default function App(): JSX.Element {
    const { isAuth, setAuthState } = useAuth();

    const [isInit, setIsInit] = useState(false);

    useEffect(() => {
        ConsoleLogger.LogGreen('BRICKS:INIT');

        BricksTemplate.init();
        setIsInit(true);

        void (async () => {
            try {
                const res = await API.GET('/');

                setAuthState({
                    isAuth: true,
                    data: res,
                });
            } catch (e) {
                //
            }
        })();
    }, [setAuthState]);

    if (!isInit) {
        return <div className="bricks__loader"></div>;
    }

    if (!isAuth) {
        return <LoginPage />;
    }

    return (
        <div className="wrapper" id="demo">
            <Router>
                <aside className="sidebar">
                    <Sidebar></Sidebar>
                </aside>
                <section className="content">
                    <div className="page">
                        <Switch>
                            <Route path="/entity/key/:key/id/:id">
                                <EditEntityPage />
                            </Route>
                            <Route path="/entity/key/:key/new">
                                <NewEntityPage />
                            </Route>
                            <Route path="/entity/key/:key">
                                <EntityPage />
                            </Route>
                            {/* <Route path="/user/login">
                                <LoginPage />
                            </Route> */}
                            <Route path="/">
                                <HomePage />
                            </Route>
                        </Switch>
                    </div>
                </section>
            </Router>
        </div>
    );
}
