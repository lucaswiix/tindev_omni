import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Login from './pages/Login';
import Main from './pages/Main';
import pageNotFound from './pages/notFoundPage';

export default function Routes(){
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Login} />
                <Route path="/devs" component={Main} />
                <Route component={pageNotFound} />
            </Switch>
        </BrowserRouter>
    );
}