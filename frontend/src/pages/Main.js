import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.svg';

import like from '../assets/like.svg';
import dislike from '../assets/dislike.svg';
import './Main.css';

import api from '../services/api';

export default function Main({ history }){

    const [users, setUsers] = useState([]);
    const sessionId = sessionStorage.getItem('_id');

    useEffect(() => {
        async function loadDevs() {
            const response = await api.get('/devs', {
                headers: {
                    user: sessionStorage.getItem('_id')
                }
            });
            
            setUsers(response.data);
        }

        if(sessionId != null)
            loadDevs();

    }, [sessionId]);

    async function handleLike(id){
        await api.post(`/devs/${id}/likes`, {}, {
            headers: { user: sessionId }
        });

        setUsers(users.filter(user => user._id !== id));

    };

    async function handleDislike(id){
        await api.post(`/devs/${id}/dislikes`, null, {
            headers: { user: sessionId }
        });
        setUsers(users.filter(user => user._id !== id));
    };

    return (
        <div className="main-container" > 
        { sessionId ? '' : history.push('/')}       
                <img src={logo} alt="Tindev" onClick={()=> history.push('/')}/>
                { users.length > 0 ? (
            <ul>
                    {users.map(user => (
                    <li key={user._id}>
                    <img src={user.avatar} alt={user.avatar} />
                    <footer>
                        <strong>{user.name != null ? user.name : user.user}</strong>
                        <p>{user.bio}</p>
                    </footer>

                    <div className="buttons">
                        <button type="button" onClick={() => handleDislike(user._id)}>
                            <img src={dislike} alt="Likes" />
                        </button>
                        <button type="button" onClick={() => handleLike(user._id)}>
                            <img src={like} alt="Likes" />
                        </button>
                    </div>
                </li>
                ))}
            </ul>
                ) : (
                    <div className="empty">Nobody more =(</div>
                    )}                

        </div>
    );
}