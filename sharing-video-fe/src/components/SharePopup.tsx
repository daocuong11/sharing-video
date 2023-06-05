import './SharePopup.css';
import axios from 'axios';
import { useState } from 'react';

function SharePopup(props: any) {
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  

  const shareClick = () => {
    const access_token = localStorage.getItem("access_token");

    if (title && link && access_token) {
      axios.post(`http://localhost:3001/shared-video`, { title, link }, {
        headers: {
          'Authorization': `Bearer ${access_token}` 
        }
      })
        .then(res => {
          if (res.data) {
            props.showPopup(false);
          }
        })
    }
  };

  return (
    <>
      <div className="popup-content">
        <div className="content">
          <div className="content-row">
            <span>Title</span>
            <input type="text" name="title" onChange={(event) => setTitle(event.target.value)}/>
          </div>
          <div className="content-row">
            <span>Link</span>
            <input type="text" name="link" onChange={(event) => setLink(event.target.value)}/>
          </div>
          <div className="content-row">
            <button onClick={shareClick}> Save </button>
            <button onClick={() => { props.showPopup(false); }}> Cancel </button>
          </div>
        </div>
      </div>
      <div className="popup-background"></div>
    </>
  );
}

export default SharePopup;
