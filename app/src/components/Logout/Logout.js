import { useWeb3React } from "@web3-react/core";
import React from "react";
import useConnectiton from "../../connectors/hooks";

import "./logout.css";
import logoutImgLight from "../../assets/pic/logout-light.png";
import logoutImgDark from "../../assets/pic/logout-dark.png";

const Logout = ({ isDarkMode, setIsLogout }) => {
  const { connector, account, deactivate } = useWeb3React();
  const {Connect} = useConnectiton()
  async function disconnect() {
    // if (connector?.deactivate) {
    //   connector.deactivate();
    // } else {
    //   connector.resetState();
    // }
    await Connect('Network')
  }

  return (
    <div className="logout" style={
        isDarkMode
          ? {
              background:
                "linear-gradient(225.23deg, #0F0C29 -3.27%, #0F0C29 -3.26%, #302B63 47.48%, #24243E 103.26%",
              color: "#ffffff",
            }
          : {}
      }
      onClick={(e) => e.stopPropagation()}>
      <div className="logout-img">
        <img alt="" src={isDarkMode ? logoutImgDark : logoutImgLight} />
      </div>
      <div className="logout-account">
        {String(account).substring(0, 6) +
          "..." +
          String(account).substring(38)}
      </div>
      <div className="logout-txt">
        Oh no! You are leaving... <br />
        Are you sure?
      </div>
      <div className="logout-btn" onClick={()=>setIsLogout(false)}>Naah, Just Kidding</div>
      <div
        className="logout-btn"
        onClick={() => {
          disconnect();
          setIsLogout(false);
        }}
      >
        Yes, Log Me Out
      </div>
    </div>
  );
};

export default Logout;
