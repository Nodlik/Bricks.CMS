import * as API from './utils/API';

import { Content, Layout, Sidebar } from './components/UI/Layout';
import { FoldersMenu, SidebarHeader } from './components/SideMenu';
import React, { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import useAJAX, { RequestStatus } from './hooks/ajax';

import BricksTemplate from '@libs/BricksTemplate';
import ConsoleLogger from './utils/ConsoleLogger';
import EditEntityPage from './pages/EditEntityPage';
import EntityPage from './pages/EntityPage';
import HomePage from './pages/HomePage';
import { JWTData } from '@libs/types/AppTypes';
import Loader from './components/UI/Loader';
import LoginPage from './pages/LoginPage';
import NewEntityPage from './pages/NewPage';
import useAuth from './hooks/auth';

export default function App(): JSX.Element {
    const [isReady, setIsReady] = useState(false);

    const { isAuth, setAuthState } = useAuth();
    const { result, send } = useAJAX<JWTData>();

    useEffect(() => {
        ConsoleLogger.LogGreen('BRICKS:INIT');

        BricksTemplate.init();
        send(API.GET('/'));
    }, [send]);

    useEffect(() => {
        if (result.status === RequestStatus.SUCCESS) {
            setAuthState({
                isAuth: true,
                data: result.response,
            });
        }
        if (result.isDone) {
            setIsReady(true);
        }
    }, [result.status, result.response, result.isDone, setAuthState]);

    if (!isReady) {
        return <Loader />;
    }

    const renderer = (
        <Router>
            <Layout>
                <Sidebar>
                    <SidebarHeader></SidebarHeader>
                    <FoldersMenu></FoldersMenu>
                </Sidebar>
                <Content>
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
                </Content>
            </Layout>
        </Router>
        // <div className="app">
        //     <Router>
        //         <aside className="sidebar">
        //             <Sidebar></Sidebar>
        //         </aside>
        //         <section className="content">
        //             <main className="page">
        //                 <Switch>
        //                     <Route path="/entity/key/:key/id/:id">
        //                         <EditEntityPage />
        //                     </Route>
        //                     <Route path="/entity/key/:key/new">
        //                         <NewEntityPage />
        //                     </Route>
        //                     <Route path="/entity/key/:key">
        //                         <EntityPage />
        //                     </Route>
        //                     <Route path="/">
        //                         <HomePage />
        //                     </Route>
        //                 </Switch>
        //             </main>
        //         </section>
        //     </Router>
        // </div>
    );

    return <div className="container">{isAuth ? renderer : <LoginPage />}</div>;
}
