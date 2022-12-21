import React from "react";
import { useState, useEffect } from "react";
import { socketService } from "../../services/socket.service";
import ScrollToBottom from "react-scroll-to-bottom";
import { useSelector } from "react-redux";
import { selectAllPlayers } from "../../features/playersSlice";
import { useWeb3React } from "@web3-react/core";
import { toast } from "react-toastify";
import EmojiPicker from "emoji-picker-react";
import { useDispatch } from "react-redux";
import { addMsg, selectAllChat } from "../../features/chatSlice";

import "./chat.css";
import hamburgerIcon from "../../assets/pic/chat-hamburger.png";
import searchIcon from "../../assets/pic/search-icon.png";
import activesIcon from "../../assets/pic/chat-actives.png";
import sendBtn from "../../assets/pic/chat-send-btn.png";
import smileyIcon from "../../assets/pic/chat-smiley-icon.png";
import exitIcon from "../../assets/pic/exit-icon-white.png";

const Chat = ({
  userData,
  setUserData,
  room,
  setRoom,
  onlineUsers,
  randomId,
  closeFunc
}) => {
  const [filterMyPlayer, setFilterMyPlayer] = useState("");
  const [isModal, setIsModal] = useState(null);
  const [currentMsg, setCurrentMsg] = useState("");
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const messageList = useSelector(selectAllChat);
  const players = useSelector(selectAllPlayers);
  const { account } = useWeb3React();

  useEffect(() => {
    socketService.emit("join_room", room);
  }, []);

  const getMyPlayers = () => {
    let myPlayers = players.filter((player) => {
      if (player.owner === account) {
        if (filterMyPlayer === "Dead") {
          return !player.player[4];
        }
        if (filterMyPlayer === "") return true;
        return player.player[1] === filterMyPlayer;
      }
    });
    myPlayers = myPlayers.map((player) => {
      const name =
        player.player[1] + " " + "#" + player.player[0].split("#")[1];
      const pic = player.player[4]
        ? player.player[1].toLowerCase()
        : `dead${player.player[1]}`;
      let style;
      if (!player.player[4]) {
        style = { color: "#969696" };
      } else if (player.player[1] === "Turtle") {
        style = { color: "#FF497F" };
      } else {
        style = { color: "#4971FF" };
      }
      return { name, pic, style };
    });
    return myPlayers;
  };

  const sendMessage = async () => {
    if (currentMsg !== "") {
      if (isAllowToSend()) {
        const messageData = {
          room,
          name: userData.name,
          pic: userData.pic,
          style: userData.style,
          message: currentMsg,
          time: Date.now(),
        };
        dispatch(addMsg(messageData));
        socketService.emit("send_message", messageData);
        setCurrentMsg("");
      }
    }
  };

  const changeRoom = (room) => {
    setIsModal(null);
    socketService.emit("join_room", room);
    setRoom(room);
  };

  const isAllowToSend = () => {
    let myPlayers = [];
    players.map((player) => {
      if (player.owner === account) {
        myPlayers.push(player);
      }
    });
    if (room === "General") {
      return true;
    }
    if (room === "Rabbit") {
      if (myPlayers.some((player) => player.player[1] === room)) {
        if (userData.name.split(' ')[0] === "Rabbit") return true;
        else toast.info(`You need to choose your Rabbit warrior to send message`);
      } else {
        toast.info(`You need to have Rabbit warrior to send message`);
      }
    }
    if (room === "Turtle") {
      if (myPlayers.some((player) => player.player[1] === room)) {
        if (userData.name.split(' ')[0] === "Turtle") return true;
        else toast.info(`You need to choose your Turtle warrior to send message`);
      } else {
        toast.info(`You need to have Turtle warrior to send message`);
      }
    }
    return false;
  };

  const getTimeformat = (time) => {
    let timeSplit = new Date(time).toString().split(" ");
    if (
      Number(timeSplit[2]) === new Date(Date.now()).getDate() &&
      time + 1000 * 60 * 60 * 24 > Date.now()
    ) {
      return `Today at ${tConvert(timeSplit[4])}`;
    } else {
      return `${timeSplit[2]} ${timeSplit[1]} at ${tConvert(timeSplit[4])}`;
    }
  };

  const tConvert = (time) => {
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

  const getFilteredMsgs = () => {
    if (search === '') return [];
    let filteredMsgs = []
    for (const property in messageList){
      filteredMsgs = [...filteredMsgs,...messageList[property].filter(message=>{
        return message.name.toLowerCase().includes(search.toLocaleLowerCase()) ||
        message.message.toLowerCase().includes(search.toLocaleLowerCase())
      })]
    }
    return filteredMsgs
  }

  // console.log(messageList);
  return (
    <div className="chat" onClick={(e) => e.stopPropagation()}>
      <div
        className="chat-dark-screen"
        style={isModal ? {} : { background: "none", zIndex: -1 }}
        onClick={() => setIsModal(null)}
      >
        {isModal === "emoji" && (
          <EmojiPicker
            theme="dark"
            onEmojiClick={({ emoji }) => setCurrentMsg((prev) => prev + emoji)}
          />
        )}
        <div
          className="chat-room"
          style={isModal === "room" ? { left: 0 } : {}}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="chat-room-header">
            <img
              alt=""
              src={hamburgerIcon}
              style={{ cursor: "pointer" }}
              onClick={() => setIsModal(null)}
            />
            <div>CHAT</div>
          </div>
          <div className="chat-room-body">
            <div onClick={() => changeRoom("Rabbit")}>Rabbits Chat</div>
            <div onClick={() => changeRoom("Turtle")}>Turtles Chat</div>
            <div onClick={() => changeRoom("General")}>General Chat</div>
            <div onClick={() => changeRoom("Announcements")}>
              Announcements Chat
            </div>
          </div>
        </div>
        <div
          className="chat-room"
          style={isModal === "search" ? { left: 0 } : {}}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="chat-room-header chat-search-input">
            <img
              alt=""
              src={searchIcon}
              style={{ cursor: "pointer" }}
              onClick={() => setIsModal(null)}
            />
            {/* <div>Search</div> */}
            <input
              className="chat-input"
              style={{height: '30px'}}
              type="text"
              value={search}
              placeholder="Search"
              onChange={(ev) => setSearch(ev.target.value)}
            />
          </div>
          <div className="chat-room-body">
            {getFilteredMsgs().map((messageData, idx) => {
              return (
                <div className="message search-message" key={messageData.time * idx} style={{padding: '7px'}}>
                  <div className="message-pic">
                    <img
                      alt=""
                      src={require(`../../assets/pic/chat-${messageData.pic}-pic.png`)}
                    />
                  </div>
                  <div className="message-content">
                    <div className="message-content-header">
                      <div className="message-username" style={messageData.style}>
                        {messageData.name}
                      </div>
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
          </div>
        </div>
        <div
          className="chat-room"
          style={isModal === "onlineUsers" ? { left: 0 } : {}}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="chat-room-header">
            <img
              alt=""
              src={activesIcon}
              style={{ cursor: "pointer" }}
              onClick={() => setIsModal(null)}
            />
            <div>Online Players</div>
          </div>
          <div className="chat-room-body">
            {onlineUsers.map((user) => {
              return (
                <div
                  className="choose-user"
                  key={user.id}
                  style={{ background: "none", cursor: "default" }}
                >
                  <img
                    alt=""
                    src={require(`../../assets/pic/chat-${user.userData.pic}-pic.png`)}
                  />
                  <div>{user.userData.name}</div>
                  <div className="online-indication">
                    <div>Online</div>
                    <div className="green-dot"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div
          className="chat-room"
          style={isModal === "name" ? { left: 0 } : {}}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="chat-room-header chat-players">
            <img
              alt=""
              src={require(`../../assets/pic/chat-${userData.pic}-pic.png`)}
              onClick={() => setIsModal(null)}
            />
            <div style={userData.style}>{userData.name}</div>
            <div className="chat-player-filter">
              <img
                alt=""
                src={require("../../assets/pic/filter-all-players.png")}
                onClick={() => setFilterMyPlayer("")}
              />
              <img
                alt=""
                src={require("../../assets/pic/filter-dead-players.png")}
                onClick={() => setFilterMyPlayer("Dead")}
              />
              <img
                alt=""
                src={require("../../assets/pic/filter-rabbits.png")}
                onClick={() => setFilterMyPlayer("Rabbit")}
              />
              <img
                alt=""
                src={require("../../assets/pic/filter-turtles.png")}
                onClick={() => setFilterMyPlayer("Turtle")}
              />
            </div>
          </div>
          <div className="chat-room-body">
            {getMyPlayers().map((player) => {
              return (
                <div
                  className="choose-user"
                  onClick={() => {
                    setIsModal(null);
                    setUserData(player);
                  }}
                >
                  <img
                    alt=""
                    src={require(`../../assets/pic/chat-${player.pic}-pic.png`)}
                  />
                  <div style={player.style}>{player.name}</div>
                </div>
              );
            })}
            <div
              className="choose-user"
              onClick={() => {
                setIsModal(null);
                setUserData({
                  name: `Anonymous(${randomId})`,
                  pic: "anonymous",
                  style: { color: "white" },
                });
              }}
            >
              <img
                alt=""
                src={require(`../../assets/pic/chat-anonymous-pic.png`)}
              />
              <div style={{ color: "white" }}>{`Anonymous(${randomId})`}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="chat-header">
        <div className="chat-subheader">
          <div
            style={{ cursor: "pointer", height: "100%" }}
            onClick={() => setIsModal("room")}
          >
            <img alt="" src={hamburgerIcon} />
          </div>
          <div>CHAT {`(${room})`}</div>
        </div>
        {room !== "Announcements" && (
          <div
            className="chat-subheader-name"
            style={userData.style}
            onClick={() => setIsModal("name")}
          >
            {userData.name}
          </div>
        )}
        <div className="chat-subheader">
          <div
            style={{ cursor: "pointer", height: "100%" }}
            onClick={() => setIsModal("search")}
          >
            <img alt="" src={searchIcon} />
          </div>
          <div
            style={{ cursor: "pointer", height: "100%" }}
            onClick={() => setIsModal("onlineUsers")}
          >
            <img alt="" src={activesIcon} />
          </div>
          <div
            className="exit-icon"
            onClick={closeFunc}
          >
            <img alt="" src={exitIcon} />
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
                    <div className="message-username" style={messageData.style}>
                      {messageData.name}
                    </div>
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
      {room !== "Announcements" && (
        <div className="chat-footer">
          <div className="chat-smiley-icon" onClick={() => setIsModal("emoji")}>
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
      )}
    </div>
  );
};

export default Chat;
