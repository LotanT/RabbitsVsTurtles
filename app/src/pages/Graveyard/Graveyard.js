import React, { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { getPlayersStatus, selectAllPlayers } from "../../features/playersSlice";
import { useSelector } from "react-redux";
import { selectAllInfo } from "../../features/infoSlice";
import { Flip, toast } from "react-toastify";

import "./graveyard.css";
import ChoosePlayer from "../../components/ChoosePlayer/ChoosePlayer";
import Player from "../../components/Player/Player";
import MainBtn from "../../components/MainBtn/MainBtn";
import backgroundImg from "../../assets/pic/graveyard-background.png";
import backBtn from "../../assets/pic/arrow-left-btn.png";

const Graveyard = ({confirmTransaction, isAudio}) => {
  const [choosenPlayer, setChoosenPlayer] = useState();
  const [activeStage, setActiveStage] = useState("choosePlayer");
  const [playersData, setPlayersData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { accounts } = useWeb3React();
  const revivePlayerCost = "500000000000000000000";
  const players = useSelector(selectAllPlayers)
  const playersStatus = useSelector(getPlayersStatus)
  const info = useSelector(selectAllInfo)
  const audio = new Audio(require('../../assets/music/Illusory Realm - Graveyard.mp3'))
  audio.loop = true

  useEffect(()=>{
    let filterPlayers = players.filter(
      (player) =>{ 
        if(choosenPlayer?.id === player.id) setChoosenPlayer(player)
        return !player.player[4]
      });
      setPlayersData(filterPlayers)
  },[players])

  useEffect(()=>{
    if(isAudio) audio.play()
    else{
      audio.pause()
      audio.currentTime = 0;
    }
    return ()=>{
      audio.pause()
      audio.currentTime = 0;
    }
  },[isAudio])

  const setChoosen = (choosen) => {
    setChoosenPlayer(choosen);
    setActiveStage("revive");
  };

  const revivePlayer = async () => {
    if(accounts && accounts[0]){
    const params = {
      to: info.contractJSON.address,
      from: accounts[0],
      value: String(info.web3.utils.toHex(Number(revivePlayerCost))),
      data: info.contract.methods
        .revivePlayer(choosenPlayer.player[0].split("#")[1])
        .encodeABI(),
    };
    const res = confirmTransaction(params, {action: 'Revive', txt: 'You are about to revive player number #4', img: choosenPlayer.image, symbol: 'heart'})
    if(res){
      toast.info('Insufficient funds', {
        position: "bottom-left",
        autoClose: 3000,
        transition: Flip,
      });
    }
  } else{
    toast.info('Connect your wallet', {position: "bottom-left"})
  }
  };
 
  if(isLoading) return <div className="graveyard-background-small"> <img alt="" src={backgroundImg} style={{display: 'none'}} onLoad={() => setIsLoading(false)}/><div className="loader-container" style={{height: '35%'}}><div className="loader"></div></div></div>
  return (
    <div className="graveyard">
      {activeStage === "choosePlayer" && playersStatus === 'succeeded' && !playersData.length && <div className="no-players-dead"><img alt="" src={require('../../assets/pic/revive-frame.png')}/><div>There are no dead players in the Graveyard.</div></div>}
      {activeStage === "choosePlayer" && (
        <ChoosePlayer playersData={playersData} setChoosen={setChoosen} />
      )}
      {activeStage === "revive" && (
        <div className="revive-player">
          <div className="revive-back-btn" onClick={() => setActiveStage("choosePlayer")}><img alt="" src={backBtn}/></div>
          <Player
            player={choosenPlayer}
            height="50%"
            onClickFunc={() => setActiveStage("choosePlayer")}
          />
          <div className="revive-txt">
            <div>{`You choosed to revive player number #${
              choosenPlayer.player[0].split("#")[1]
            }`}</div>
            <div>Are you sure?</div>
          </div>
          <div className="revive-btn">
            <MainBtn txt="revive" func={revivePlayer} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Graveyard;
