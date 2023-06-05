import React, { useState } from 'react';
import LogoImage from '../logo.png'
import './Head.css';
import axios from 'axios';

function Head(props: any) {
  const access_token = localStorage.getItem("access_token");

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [logedIn, setLogedIn] = useState(!!access_token);

  const loginClick = () => {
    if (username && password) {
      axios.post(`http://localhost:3001/auth/login`, { username, password })
        .then(res => {
          if (res.data?.access_token) {
            setLogedIn(true);
            localStorage.setItem("access_token", res.data?.access_token);
          }
        })
    }
  };

  return (
    <div className="header">
      <div className="logo">
        <img src={LogoImage} alt="" />
        <h2>Funny Movies</h2>
      </div>
      {
        !logedIn ?
          <div className="frm-login">
            <input type="text" placeholder="email" onChange={(event) => setUsername(event.target.value)} />
            <input type="password" placeholder="password" onChange={(event) => setPassword(event.target.value)} />
            <button onClick={loginClick}>Login</button>
            <button onClick={() => props.showRegisterPopup(true)}>Register</button>
          </div>
          :
          <div className="frm-login">
            <button onClick={() => { props.showPopup(true); }}>Share Video</button>
          </div>
      }


    </div>
  );
}

export default Head;
