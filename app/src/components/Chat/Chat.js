import React from "react";
import { useState } from "react";

import './chat.css'
import hamburgerIcon from '../../assets/pic/chat-hamburger.png'
import searchIcon from '../../assets/pic/search-icon.png'
import activesIcon from '../../assets/pic/chat-actives.png'
import { useEffect } from "react";

const Chat = ({socket, username, room}) => {

  const [cuurentMsg, setCurrentMsg] = useState('')

  const sendMessage = async ()=>{
    if(cuurentMsg !== ''){
      const messageData = {
          room,
          author: username,
          message: cuurentMsg,
          time: Date.now(),
      }

      await socket.emit('send_message', messageData)
    }
  }

  useEffect(()=>{
    socket.on('receive_message', (data)=>{
      
    })
  },[socket])

  return (
    <div className="chat">
      <div className="chat-header">
        <div className="chat-subheader">
          <div><img alt="" src={hamburgerIcon}/></div>
          <div>CHAT</div>
        </div>
        <div className="chat-subheader">
          <div><img alt="" src={searchIcon}/></div>
          <div><img alt="" src={activesIcon}/></div>
        </div>
      </div>
      <div className="chat-body">
        <div>
        <div></div>
        <div></div>
        </div>
      </div>
      <div className="chat-footer">
        <input type='text' placeholder="Type your message here..." onChange={(ev)=>setCurrentMsg(ev.target.value)}/>
        <button></button>
      </div>
    </div>
  );
};

export default Chat;
