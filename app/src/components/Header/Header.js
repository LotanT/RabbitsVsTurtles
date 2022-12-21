import React, { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAllEvents } from "../../features/eventsSlice";
import { selectAllPlayers } from "../../features/playersSlice";

import "./header.css";
import lighting from "../../assets/pic/btn-lighting.png";
import heart from "../../assets/pic/btn-heart.png";
import swords from "../../assets/pic/btn-swords.png";
import flags from "../../assets/pic/btn-flags.png";
import logo from "../../assets/pic/game-logo.png";
import account from "../../assets/pic/header-account.png";
import leaderboardIcon from "../../assets/pic/leader-board-icon.png";
import accountGuest from "../../assets/pic/header-account-guest.png";
import notificationIcon from "../../assets/pic/notification-icon.png";
import notificationMuteIcon from "../../assets/pic/notification-mute-icon.png";
import diamondIcon from "../../assets/pic/diamond-btn.png";
import walletIcon from "../../assets/pic/wallet-btn.png";
import WalletDetails from "../WalletDetails/WalletDetails";
import Logout from "../Logout/Logout";
import Events from "../Events/Events";
import Leaderboard from "../Leaderboard/Leaderboard";
import { selectAllDarkMode } from "../../features/darkModeSlice";

const Header = ({ setActiveModal, balance, setIsNotification, isNotification, isAudio, setIsAudio }) => {
  const [isWalletDetails, setIsWalletDetails] = useState(false);
  const [isEvents, setIsEvents] = useState(false);
  const [isLeaderboard, setIsLeaderboard] = useState(false);
  const { accounts } = useWeb3React();
  const [isLogout, setIsLogout] = useState(false);
  const [counter, setCounter] = useState(-1);
  const [openLinks, setOpenLinks] = useState(true);
  const events = useSelector(selectAllEvents)
  const players = useSelector(selectAllPlayers)
  const isDarkMode = useSelector(selectAllDarkMode)
  const location = useLocation()

  useEffect(()=>{
    if(!isEvents && counter < 99) setCounter(counter+1)
  },[events])

  useEffect(()=>{
    if(isEvents) setCounter(0)
  },[isEvents])

  const getLightingStyle = () => {
    if(accounts && accounts.length){
      if(!players.some(player=>player.owner === accounts[0])){
        return 'glowing-lighting'
      }
    }
    return ''
  }

  return (
    <div className="header" style={location.pathname === '/'? {display: 'none'} : {}}>
      <div className={openLinks? "header-links" : "header-links header-margin-top"} onClick={()=>setOpenLinks(!openLinks)}>
        <div className="header-links-container">
          <div className="lightin-links" style={{zIndex: '1'}}><img alt="" src={diamondIcon} /></div>
          <Link style={!openLinks?{top: '45px', opacity: '1'}:{}} to="/mint">
            <img alt="" src={lighting} className={getLightingStyle()}/>
          </Link>
          <Link style={!openLinks?{top: '90px', opacity: '1'}:{}} to="/graveyard">
            <img alt="" src={heart} />
          </Link>
          <Link style={!openLinks?{top: '135px', opacity: '1'}:{}} to="/arena">
            <img alt="" src={swords} />
          </Link>
          <Link style={!openLinks?{top: '180px', opacity: '1'}:{}} to="/overview">
            <img alt="" src={flags} />
          </Link>
        </div>
      </div>
      <Link to="/map" className="header-logo">
        <img alt="" src={logo} style={{ height: "100%" }} />
      </Link>
      <div className="header-account">
        <div
          className="header-account-container"
          onClick={() =>setIsWalletDetails(!isWalletDetails)}
        >
          <img className="header-fullscreen" alt="" src={accounts?.length ? account : accountGuest} />
          <div className="header-fullscreen" style={!accounts?.length ? { color: "white" } : {}}>
            {accounts?.length
              ? String(accounts[0]).substring(0, 6) +
                "..." +
                String(accounts[0]).substring(38)
              : `Connect Wallet`}
          </div>
          <div className="header-smallscreen"><img alt="" src={walletIcon}/></div>
        </div>
        <div className="header-events" onClick={() => setIsLeaderboard(true)}>
          <img alt="" src={leaderboardIcon} />
        </div>
        <div className="header-events" onClick={() => setIsEvents(true)}>
          <img alt="" src={isNotification? notificationIcon : notificationMuteIcon} />
          {counter !== 0 && <div className="notification-unread">{counter}</div>}
        </div>
      </div>
      {isWalletDetails && (
        <div
          className="outside-click"
          onClick={() => setIsWalletDetails(false)}
        >
          <WalletDetails
            balance={balance}
            setIsWalletDetails={setIsWalletDetails}
            setIsLogout={setIsLogout}
            isAudio={isAudio}
            isNotification={isNotification}
            setIsAudio={setIsAudio}
            setIsNotification={setIsNotification}
            setIsLeaderboard={setIsLeaderboard}
            counter={counter}
            setCounter={setCounter}
            setActiveModal={setActiveModal}
          />
        </div>
      )}
          {isLeaderboard && (
            <div className="outside-click" onClick={() => setIsLeaderboard(false)}>
              <Leaderboard setIsLeaderboard={setIsLeaderboard}/>
            </div>
          )}
      {isEvents && (
        <div className="outside-click" onClick={() => setIsEvents(false)}>
          <Events closeFunc={()=>setIsEvents(false)} isDarkMode={isDarkMode} isNotification={isNotification} setIsNotification={setIsNotification} />
        </div>
      )}
      {isLogout && (
        <div className="outside-click" onClick={() => setIsLogout(false)}>
          <Logout isDarkMode={isDarkMode} setIsLogout={setIsLogout} />
        </div>
      )}
    </div>
  );
};

export default Header;
