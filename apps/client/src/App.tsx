/* eslint-disable react-hooks/exhaustive-deps */
import * as API from './utils/API';

import React, { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

import BricksTemplate from '@libs/BricksTemplate';
import ConsoleLogger from './utils/ConsoleLogger';
import EditEntityPage from './pages/EditEntityPage';
import EntityPage from './pages/EntityPage';
import HomePage from './pages/HomePage';
import Loader from './components/UI/Loader';
import LoginPage from './pages/LoginPage';
import NewEntityPage from './pages/NewPage';
import Sidebar from './components/Sidebar';
import useAJAX from './hooks/ajax';
import useAuth from './hooks/auth';

export default function App(): JSX.Element {
    const [isReady, setIsReady] = useState(false);

    const { isAuth, setAuthState } = useAuth();
    const { send } = useAJAX();

    useEffect(() => {
        ConsoleLogger.LogGreen('BRICKS:INIT');

        BricksTemplate.init();

        void (async () => {
            const res = await send(API.GET('/'));
            if (res) {
                setAuthState({
                    isAuth: true,
                    data: res,
                });
            }

            setIsReady(true);
        })();
    }, []);

    if (!isReady) {
        return <Loader />;
    }

    const renderer = (
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
                        <Route path="/">
                            <HomePage />
                        </Route>
                    </Switch>
                </div>
            </section>
        </Router>
    );

    return <div className="container">{isAuth ? renderer : <LoginPage />}</div>;
}
