import React, { useState } from "react";

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
import { Link, useLocation } from "react-router-dom";
import MyPlayers from "../MyPlayers/MyPlayers";
import muteBtn from "../../assets/pic/sound-mute.png";
import unmuteBtn from "../../assets/pic/sound-unmute.png";
import { useWeb3React } from "@web3-react/core";
import {toast} from 'react-toastify'
import { CHAINS } from "../../connectors/chains";

const Footer = ({ isDarkMode, isAudio, setIsAudio }) => {
  
  const [isNetwork, setIsNetwork] = useState(false);
  const [isMyWarriors, setIsMyWarriors] = useState(false);
  const {accounts, chainId} = useWeb3React()
  const location = useLocation()
  
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
              toast.warning('Connect your wallet to see your warrior')
            }
          }}
        >
          <img alt="" src={goldFrame} />
          <div className="side-txt">My Warriors</div>
        </div>
      </div>
      <div className="footer-center">
        <img alt="" src={goldFrame} />
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
      <div className="footer-side right" onClick={() => setIsNetwork(true)}>
        <div className="footer-network">
          <img alt="" src={goldFrame} />
          <div className="side-txt">{CHAINS[chainId]?.name}</div>
        </div>
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
    </div>
  );
};

export default Footer;
