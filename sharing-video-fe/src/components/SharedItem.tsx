import React from 'react';
import VideoImage from '../video.png'
import './SharedItem.css';

function SharedItem(props: any)  {
  const item = props.data;

  return (
    <div className="item">
      <img src={VideoImage} alt=""/>
      <div className="description">
        <h3>{item.title}</h3>
        <span>Shared By: <b>{item.sharedBy}</b></span>
      </div>
    </div>
  );
}

export default SharedItem;
