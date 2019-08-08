import React from 'react';
import logo from '../assets/logo.svg';
import './Login.css';

const notFoundPage = () => {
    return (
        <div className="login-container">
            <form>
            <img src={logo} alt="Tindev" />
            <h1 className="notfound-text">Page not found =(</h1>
            </form>
        </div>
    );
};

export default notFoundPage;