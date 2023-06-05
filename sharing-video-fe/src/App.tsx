import React, { useEffect, useState } from 'react';
import './App.css';
import Head from './components/Head';
import SharedItem from './components/SharedItem';
import axios from 'axios';
import SharePopup from './components/SharePopup';
import RegisterPopup from './components/RegisterPopup';
import { socket } from './socket';

function App() {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(0);
  const [showSharingVideoPopup, setShowSharingVideoPopup] = useState(false);
  const [showRegisterPopup, setShowRegisterPopup] = useState(false);
  const [notification, setNotification] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    socket.connect();

    socket.on('message', (event) => {
      if (event.sharevideo) {
        let sharevideo = event.sharevideo;
        let message = `${sharevideo.title} has shared by ${sharevideo.sharedBy}`;
        setNotification(true);
        setMessage(message);

        setInterval(() => {
          setNotification(false);
        },5000)
      }
    })
  }, []);

  const pageSize: number = 10;

  useEffect(
    () => {
      axios.get(`http://localhost:3001/shared-video?pageSize=${pageSize}&pageIndex=${page}`)
        .then(({ data }) => {
          if (data) {
            setVideos(data);
          }
        })
        .catch(error => console.log(error));
    },
    [page]
  );

  return (
    <div className="App">
      <Head showPopup={setShowSharingVideoPopup} showRegisterPopup={setShowRegisterPopup}></Head>
      {
        videos.map((e, index) => (
          <SharedItem key={index} data={e}></SharedItem>
        ))
      }
      <div className="footer">
        <button onClick={() => setPage(page - 1)}>previous</button>
        <button onClick={() => setPage(page + 1)}>next</button>
      </div>

      {
        (showSharingVideoPopup) ?
          <SharePopup showPopup={setShowSharingVideoPopup}></SharePopup> :
          <></>
      }

      {
        (showRegisterPopup) ?
          <RegisterPopup showPopup={setShowRegisterPopup}></RegisterPopup> :
          <></>
      }

      {        
        (notification) ?
          <div className="notification"> {message}</div> :
          <></>
      }

    </div>
  );
}

export default App;
