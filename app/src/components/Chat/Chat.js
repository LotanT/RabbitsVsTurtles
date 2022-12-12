import React from "react";
import { useState, useEffect } from "react";
import { socketService } from "../../services/socket.service";
import ScrollToBottom from "react-scroll-to-bottom";
import { useSelector } from "react-redux";
import { selectAllPlayers } from "../../features/playersSlice";
import { useWeb3React } from "@web3-react/core";
import { httpService } from "../../services/http.service";

import "./chat.css";
import hamburgerIcon from "../../assets/pic/chat-hamburger.png";
import searchIcon from "../../assets/pic/search-icon.png";
import activesIcon from "../../assets/pic/chat-actives.png";
import sendBtn from "../../assets/pic/chat-send-btn.png";
import smileyIcon from "../../assets/pic/chat-smiley-icon.png";

const Chat = () => {
  const [room, setRoom] = useState("Rabbit");
  const [isModal, setIsModal] = useState(null);
  const [currentMsg, setCurrentMsg] = useState("");
  const [userData, setUserData] = useState({
    name: "Anonymous",
    pic: "anonymous",
    style: {color: 'white'}
  });
  const [messageList, setMessageList] = useState({
    Rabbit: [],
    Turtle: [],
    All: [],
  });
  const players = useSelector(selectAllPlayers);
  const { accounts } = useWeb3React();

  useEffect(() => {
    initChat();
    socketService.emit("join_room", room);
    socketService.on("receive_message", (data) => {
      setMessageList((prev) => {
        prev[data.room].push(data);
        return prev;
      });
    });
    return () => {
      socketService.off("recive_message");
    };
  }, []);

  const getMyPlayers = () => {
    let myPlayers = [] 
    players.map(player=>{
      if(player.owner === accounts[0]){
        const name = player.player.playerType +" "+'#' + player.player.name.split('#')[1]
        const pic = player.player.alive? player.player.playerType.toLowerCase():`dead${player.player.playerType}`
        let style
        if(!player.player.alive){
          style = {color: '#969696'}
        }else if(player.player.playerType === 'Turtle'){
          style = {color: '#FF497F'}
        }else{
          style = {color: '#4971FF'}
        }
        myPlayers.push({name, pic, style})
      }
    })
    return myPlayers
  }

  const initChat = async () => {
    const chats = await httpService.get("chat");
    console.log(chats);
    setMessageList(chats);
  };

  const sendMessage = async () => {
    if (currentMsg !== "") {
      const messageData = {
        room,
        name: userData.name,
        pic: userData.pic,
        style: userData.style,
        message: currentMsg,
        time: Date.now(),
      };
      setMessageList((prev) => {
        prev[room].push(messageData);
        return prev;
      });
      socketService.emit("send_message", messageData);
      setCurrentMsg("");
    }
  };

  const getTimeformat = (time) => {
    let timeSplit = new Date(time).toString().split(" ");
    if (
      Number(timeSplit[2]) === new Date(Date.now()).getDate() &&
      time + 1000 * 60 * 60 * 24 > Date.now()
    ) {
      return `Today at ${tConvert(timeSplit[4])}`;
    } else {
      return `${timeSplit[2]} ${timeSplit[1]}`;
    }
  };

  function tConvert(time) {
    time = time
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
    if (time.length > 1) {
      time = time.slice(1, 4);
      time[5] = +time[0] < 12 ? "AM" : "PM";
      time[0] = +time[0] % 12 || 12;
    }
    return time.join("");
  }

  // console.log(messageList);
  return (
    <div className="chat" onClick={(e)=>e.stopPropagation()}>
      <div className="chat-dark-screen" style={isModal? {}: {background: 'none', zIndex: -1}} onClick={()=>setIsModal(null)}>
        <div className="chat-room" style={isModal? {left: 0}: {}} onClick={e=>{e.stopPropagation()}}>
          <div className="chat-room-header">
              <img alt="" src={hamburgerIcon} style={{ cursor: "pointer" }} onClick={()=>setIsModal(null)}/>
            <div>CHAT</div>
          </div>
          <div className="chat-room-body">
            <div onClick={()=>{
              setRoom('Rabbit')
              setIsModal(null)
            }}>Rabbits Chat</div>
            <div onClick={()=>{
              setIsModal(null)
              setRoom('Turtle')}}>Turtles Chat</div>
            <div onClick={()=>{
              setIsModal(null)
              setRoom('General')}}>General Chat</div>
            <div>Announcements Chat</div>
          </div>
        </div>
        <div className="chat-room" style={isModal=== 'name'? {left: 0}: {}} onClick={e=>{e.stopPropagation()}}>
          <div className="chat-room-header">
            <img alt="" src={require(`../../assets/pic/chat-${userData.pic}-pic.png`)} onClick={()=>setIsModal(null)}/>
            <div style={userData.style}>{userData.name}</div>
          </div>
          <div className="chat-room-body">
            {getMyPlayers().map(player=>{
              return(
                <div className="choose-user" onClick={()=>{
                  setIsModal(null)
                  setUserData(player)}}>
                  <img alt="" src={require(`../../assets/pic/chat-${player.pic}-pic.png`)}/>
                  <div style={player.style}>{player.name}</div>
                </div>
              )
            })}
                <div className="choose-user" onClick={()=>{
                  setIsModal(null)
                  setUserData({
                    name: "Anonymous",
                    pic: "anonymous",
                    style: {color: 'white'}
                  })}}>
                  <img alt="" src={require(`../../assets/pic/chat-anonymous-pic.png`)}/>
                  <div style={{color: 'white'}}>Anonymous</div>
                </div>
          </div>
        </div>
      </div>
      <div className="chat-header">
        <div className="chat-subheader">
          <div style={{ cursor: "pointer" }} onClick={()=>setIsModal('room')}>
            <img alt="" src={hamburgerIcon} />
          </div>
          <div>CHAT {`(${room})`}</div>
        </div>
        <div className="chat-subheader-name" style={userData.style} onClick={()=>setIsModal('name')}>
          {userData.name}
        </div>
        <div className="chat-subheader">
          <div>
            <img alt="" src={searchIcon} />
          </div>
          <div>
            <img alt="" src={activesIcon} />
          </div>
        </div>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="chat-body-container">
          {messageList[room].map((messageData, idx) => {
            return (
              <div className="message" key={messageData.time * idx}>
                <div className="message-pic">
                  <img
                    alt=""
                    src={require(`../../assets/pic/chat-${messageData.pic}-pic.png`)}
                  />
                </div>
                <div className="message-content">
                  <div className="message-content-header">
                    <div className="message-username" style={messageData.style}>{messageData.name}</div>
                    <div className="message-time">
                      {getTimeformat(messageData.time)}
                    </div>
                  </div>
                  <div className="message-content-txt">
                    {messageData.message}
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <div className="chat-smiley-icon">
          <img alt="" src={smileyIcon} />
        </div>
        <input
          className="chat-input"
          type="text"
          value={currentMsg}
          placeholder="Type your message here..."
          onChange={(ev) => setCurrentMsg(ev.target.value)}
          onKeyDownCapture={(ev) => {
            ev.key === "Enter" && sendMessage();
          }}
        />
        <div className="chat-send-btn" onClick={sendMessage}>
          <img alt="" src={sendBtn} />
        </div>
      </div>
    </div>
  );
};

export default Chat;
