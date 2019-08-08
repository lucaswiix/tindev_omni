import React, { useState } from 'react';
import './Login.css';
import api from '../services/api';

import logo from '../assets/logo.svg';
export default function Login({ history }){
    const [username, setUsername] = useState('');
    var [errorMsg, setErrorMsg] = useState('');
    async function handleSubmit(e) {
        e.preventDefault();

        await api.post('/devs', {
            username,
        }).then(res => {
            const { _id } = res.data;
            sessionStorage.setItem('_id', _id);
            history.push('/devs');
        }).catch(error => {
            if(error.response.status === 400){
                setErrorMsg('This user dount found');
            }
        });
    }

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
            <img src={logo} alt="tindev" />
            <input
             placeholder="Digite seu usuário do Github"
             value={username}
             onChange={e => setUsername(e.target.value)}
            />
            <button type="submit">Enviar</button>
            <span className="errorMsg">{errorMsg}</span>
            </form>
        </div>
    );
}

