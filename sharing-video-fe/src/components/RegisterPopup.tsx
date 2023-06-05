import './RegisterPopup.css';
import axios from 'axios';
import { useState } from 'react';

function RegisterPopup(props: any) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


  const registerClick = () => {
    if (username && password) {
      axios.post(`http://localhost:3001/auth/register`, { username, password })
        .then(res => {
          props.showPopup(false);
        })
    }
  };

  return (
    <>
      <div className="popup-content">
        <div className="content">
        <div className="content-row">
            <span>Username</span>
            <input type="text" name="username" onChange={(event) => setUsername(event.target.value)}/>
          </div>
          <div className="content-row">
            <span>Password</span>
            <input type="password" name="password" onChange={(event) => setPassword(event.target.value)}/>
          </div>
          <div className="content-row">
            <button onClick={registerClick}> Save </button>
            <button onClick={() => { props.showPopup(false); }}> Cancel </button>
          </div>
        </div>
      </div>
      <div className="popup-background"></div>
    </>
  );
}

export default RegisterPopup;
