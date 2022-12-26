import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import {toast} from 'react-toastify'
import { CHAINS } from "../../connectors/chains";
import { useSelector } from "react-redux";
import { selectAllDarkMode } from "../../features/darkModeSlice";
import { socketService } from "../../services/socket.service";
import { utilService } from "../../services/utils.service";
import { addMsg, fetchChat } from "../../features/chatSlice";
import { useDispatch } from "react-redux";

import "./footer.css";
import goldFrame from "../../assets/pic/header-account.png";
import NetworksModal from "../NetworksModal/NetworksModal";
import potionBlueBtn from "../../assets/pic/potion-blue-btn.png";
import hatBtn from "../../assets/pic/hat-shop-btn.png";
import crownBtn from "../../assets/pic/crown-shop-btn.png";
import keyBtn from "../../assets/pic/key-shop-btn.png";
import bookBtn from "../../assets/pic/book-shop-btn.png";
import carrotBtn from "../../assets/pic/carrot-shop-btn.png";
import armorBtn from "../../assets/pic/shield-shop-btn.png";
import MyPlayers from "../MyPlayers/MyPlayers";
import muteBtn from "../../assets/pic/sound-mute.png";
import unmuteBtn from "../../assets/pic/sound-unmute.png";
import Chat from "../Chat/Chat";

const Footer = ({ isAudio, setIsAudio }) => {
  
  const [isNetwork, setIsNetwork] = useState(false);
  const [isMyWarriors, setIsMyWarriors] = useState(false);
  const [isChat, setIsChat] = useState(false);
  const {accounts, chainId} = useWeb3React()
  const location = useLocation()
  const isDarkMode = useSelector(selectAllDarkMode)
  const [room, setRoom] = useState("General");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const randomId = useRef()
  const dispatch = useDispatch()
  const [userData, setUserData] = useState({
    name: `Anonymous`,
    pic: "anonymous",
    style: { color: "white" },
  });

  useEffect(()=>{
    randomId.current = utilService.makeId(4)
    setUserData(
      {
        name: `Anonymous(${randomId.current})`,
        pic: "anonymous",
        style: { color: "white" },
      }
    )
  },[])

  useEffect(() => {
    if(chainId){
      dispatch(fetchChat(chainId));
      socketService.emit('join_chainId', chainId)
      socketService.emit("online_user", userData);
      socketService.on("online_users", (data) =>{
        setOnlineUsers(data.filter(data=>data.network === chainId));
      })
      socketService.on("receive_message", (data) => {
        dispatch(addMsg(data));
      });
    }
    return () => {
      socketService.off("online_users");
      socketService.off("recive_message");
    };
  },[chainId])

  useEffect(()=>{
    socketService.emit("online_user", userData);
  },[userData])
  // console.log(onlineUsers);
  return (
    <div className="footer" style={location.pathname === '/'? {display: 'none'} : {}}>
      <div className="footer-side">
        <div className="footer-sound" onClick={() => setIsAudio((prev)=>!prev)}>
          <img alt="" src={isAudio ? unmuteBtn : muteBtn} />
        </div>
        <div
          className="footer-my-warriors"
          onClick={() => {
            if(accounts && accounts[0]){
              setIsMyWarriors(true)
            }else{
              toast.info('Connect your wallet to see your warriors.')
            }
          }}
        >
          <img alt="" src={goldFrame} />
          <div className="side-txt">My Warriors</div>
        </div>
      </div>
      <div className="footer-center">
        <img alt="" src={goldFrame} style={{width: '100%'}}/>
        <div className="footer-links">
          <Link to="/shop/hats">
            <img alt="" src={hatBtn} />
          </Link>
          <Link to="/shop/crowns">
            <img alt="" src={crownBtn} />
          </Link>
          <Link to="/shop/books">
            <img alt="" src={bookBtn} />
          </Link>
          <Link to="/shop/shields">
            <img alt="" src={armorBtn} />
          </Link>
          <Link to="/shop/keys">
            <img alt="" src={keyBtn} />
          </Link>
          <Link to="/shop/veggies">
            <img alt="" src={carrotBtn} />
          </Link>
          <Link to="/shop/regular">
            <img alt="" src={potionBlueBtn} />
          </Link>
        </div>
      </div>
      <div className="footer-side right">
        <div className="footer-chat" onClick={() => setIsChat(true)}>
          <img alt="" src={require('../../assets/pic/chat-icon.png')} />
        </div>
        <div className="footer-network" onClick={() => setIsNetwork(true)}>
          <img alt="" src={goldFrame} />
          <div className="side-txt">{CHAINS[chainId]?.name}</div>
        </div>
      </div>
      <div className="footer-chat-small" onClick={() => setIsChat(true)}>
          <img alt="" src={require('../../assets/pic/chat-icon.png')} />
        </div>
      {isNetwork && (
        <div className="outside-click" onClick={() => setIsNetwork(false)}>
          <NetworksModal
            isDarkMode={isDarkMode}
            closeFunc={() => setIsNetwork(false)}
          />
        </div>
      )}
      {isMyWarriors&& accounts && accounts[0] && (
        <div className="outside-click" onClick={() => setIsMyWarriors(false)}>
          <MyPlayers
            isDarkMode={isDarkMode}
            closeFunc={() => setIsMyWarriors(false)}
          />
        </div>
      )}
      {isChat && <div className="outside-click" onClick={() => setIsChat(false)}>
      <Chat userData={userData} setUserData={setUserData} room={room} setRoom={setRoom} onlineUsers={onlineUsers} randomId={randomId.current} closeFunc={() => setIsChat(false)}/>
      </div>}
    </div>
  );
};

export default Footer;
