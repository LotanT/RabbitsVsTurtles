import React from "react";
import { useWeb3React } from "@web3-react/core";
import { getConnectorByName } from "../../connectors/hooks";

import "./concect-modal.css";

import metamaskIcon from "../../assets/pic/logos_metamask-icon.png";
import coinbaseWalletIcon from "../../assets/pic/coinbase-icon.png";
import walletConnectIcon from "../../assets/pic/walletconnect-icon.png";
import exitIcon from "../../assets/pic/exit-icon.png";
import useConnect from "../../connectors/hooks";

const ConnectModal = ({ setActiveModal, setChosenConnection }) => {
  const {chainId, error, activate} = useWeb3React()
  const {Connect} = useConnect()
  const connectToWallet = async (connectionName) => {
    setChosenConnection(connectionName);
    setActiveModal("waitingToConnect");
    const connection = getConnectorByName(connectionName)
    console.log(connection);
    try{
      activate(connection)
      // await Connect(connectionName, chainId)
    }catch(err){
      console.log(err);
    }
    if(error) {
      console.log(error);
      setActiveModal("failToConnect");
    }
  }

  return (
    <div className="modal-container">
      <div className="modal-header">
        <div className="connect-exit" onClick={() => setActiveModal("welcome")}>
          <img alt="" src={exitIcon} />
        </div>
        <div className="modal-title">Connect a wallet</div>
      </div>
      <div className="modal-content">
        <div
          className="modal-link"
          onClick={() => {
            connectToWallet("MetaMask");
          }}
        >
          <div className="modal-link-txt">Metamask</div>
          <div className="modal-link-img"><img alt="" src={metamaskIcon} /></div>
        </div>
        <div
          className="modal-link"
          onClick={() => {
            connectToWallet("CoinbaseWallet");
          }}
        >
          <div className="modal-link-txt">Coinbase Wallet</div>
          <div className="modal-link-img"><img alt="" src={coinbaseWalletIcon} /></div>
        </div>
        <div
          className="modal-link"
          onClick={() => {
            connectToWallet("WalletConnect");
          }}
        >
          <div className="modal-link-txt">WalletConnect</div>
          <div className="modal-link-img"><img alt="" src={walletConnectIcon} /></div>
        </div>
        <div
          className="modal-link"
          onClick={() => {
            connectToWallet("Torus");
          }}
        >
          <div className="modal-link-txt">Torus</div>
          <div className="modal-link-img"><img alt="" src={walletConnectIcon} /></div>
        </div>
        <div className="modal-link-footer">
          <span>
            By connecting a wallet, you agree to RVT Terms of Service and
            acknowledge that you have read and understand the RVT Protocol
            Disclaimer.
          </span>
        </div>
      </div>
    </div>
  );
};

export default ConnectModal;
