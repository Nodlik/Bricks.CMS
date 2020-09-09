import './index.css';

import App from './App';
import AuthContextProvider from './context/AuthContextProvider';
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
    <AuthContextProvider>
        <App />
    </AuthContextProvider>,
    document.getElementById('root')
);
