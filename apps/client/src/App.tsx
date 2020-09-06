import React, { useEffect, useState } from 'react';
import BricksTemplate from '@libs/BricksTemplate';
import Sidebar from './components/Sidebar';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import EntityPage from './pages/EntityPage';
import EditEntityPage from './pages/EditEntityPage';
import NewEntityPage from './pages/NewPage';
import HomePage from './pages/HomePage';

export default function App() {
    const [isInit, setIsInit] = useState(false);
    useEffect(() => {
        (async () => {
            await BricksTemplate.init();

            setIsInit(true);
        })();
    }, []);

    if (!isInit) return <div className="bricks__loader"></div>;

    return (
        <div className="wrapper">
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
        </div>
    );
}