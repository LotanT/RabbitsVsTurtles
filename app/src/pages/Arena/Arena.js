import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectAllPlayers } from "../../features/playersSlice";
import { selectAllInfo } from "../../features/infoSlice";
import { toast, Flip } from "react-toastify";

import "./arena.css";
import ArenaPlayer from "../../components/ArenaPlayer/ArenaPlayer";
import headerImg from "../../assets/pic/frame-top.png";
import switchPositionImg from "../../assets/pic/switch-position.png";
import MainBtn from "../../components/MainBtn/MainBtn";
import Player from "../../components/Player/Player";
import filterRabbits from "../../assets/pic/filter-rabbits.png";
import filterTurtles from "../../assets/pic/filter-turtles.png";
import filterMyPlayers from "../../assets/pic/filter-my-players.png";
import { useWeb3React } from "@web3-react/core";
import MintNewPlayer from "../../components/MintNewPlayer/MintNewPlayer";

const Arena = ({ confirmTransaction, isAudio }) => {
  const [choosenTurtle, setChoosenTurtle] = useState();
  const [choosenRabbit, setChoosenRabbit] = useState();
  const [attacker, setAttacker] = useState("Rabbit");
  const [playerHover, setPlayerHover] = useState("Rabbit");
  const [playersData, setPlayersData] = useState([]);
  const [onChoosePlayer, setOnChoosePlayer] = useState();
  const [isLoading, setIsLoading] = useState({
    header: true,
    position: true,
    rockRed: true,
    rockBlue: true,
    background: true,
  });
  const [attacking, setAttacking] = useState(false);
  const [filter, setFilter] = useState("");
  const { accounts } = useWeb3React();
  const players = useSelector(selectAllPlayers);
  const info = useSelector(selectAllInfo);
  const audio = new Audio(
    require("../../assets/music/Aggressive ENIGMA - Arena.mp3")
  );
  audio.loop = true;

  useEffect(() => {
    let filterPlayers = players.filter((player) => {
      if (choosenRabbit?.id === player.id) setChoosenRabbit(player);
      if (choosenTurtle?.id === player.id) setChoosenTurtle(player);
      return player.player[4];
    });
    setPlayersData(filterPlayers);
  }, [players]);

  useEffect(() => {
    if (isAudio) audio.play();
    else {
      audio.pause();
      audio.currentTime = 0;
    }
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [isAudio]);

  const choosePlayer = (player) => {
    if (player.player[1] === "Turtle") setChoosenTurtle(player);
    else setChoosenRabbit(player);
    setOnChoosePlayer(null);
  };

  const getPlayersToShow = () => {
    let playersToShow = playersData.filter(
      (player) => player.player[1] === onChoosePlayer
    );
    if (accounts?.length) {
      if (filter === "Mine")
        playersToShow = playersToShow.filter(
          (player) => player.owner === accounts[0]
        );
    }
    return playersToShow;
  };

  const onHover = (player) => {
    setPlayerHover(player);
  };

  const switchPosition = () => {
    if (attacker === "Turtle") setAttacker("Rabbit");
    else setAttacker("Turtle");
  };

  const attackPlayer = async () => {
    if (accounts && accounts[0]) {
      if (!choosenRabbit && !choosenTurtle) {
        toast.info("Choose Players to Attack", {
          position: "bottom-center",
          autoClose: 1500,
          transition: Flip,
        });
        return;
      }
      if (!choosenRabbit) {
        toast.info("Choose Rabbit before Attacking", {
          position: "bottom-center",
          autoClose: 1000,
          transition: Flip,
        });
        return;
      } else if (!choosenTurtle) {
        toast.info("Choose Turtle before Attacking", {
          position: "bottom-center",
          autoClose: 1000,
          transition: Flip,
        });
        return;
      }
      setAttacking(true);
      setTimeout(() => setAttacking(false), 1000);
      let attack;
      let victim;
      let desc = {
        action: "Attack",
        rabbitImg: choosenRabbit.image,
        turtleImg: choosenTurtle.image,
      };
      if (attacker === "Rabbit") {
        attack = choosenRabbit.player[0].split("#")[1];
        victim = choosenTurtle.player[0].split("#")[1];
        desc.attacker = "Rabbit";
      } else {
        attack = choosenTurtle.player[0].split("#")[1];
        victim = choosenRabbit.player[0].split("#")[1];
        desc.attacker = "Turtle";
      }
      desc.txt = `You are about to attack player number #${victim} with player number #${attack}`;
      const params = {
        to: info.contractJSON.address,
        from: accounts[0],
        data: info.contract.methods.attackPlayer(attack, victim).encodeABI(),
      };
      let res = await confirmTransaction(params, desc);
      if (res) {
        res = res.message.split(":")[2];
        toast.info(res, {
          position: "bottom-center",
          autoClose: 3000,
          transition: Flip,
        });
      }
    } else {
      toast.info("Connect your wallet", {
        position: "bottom-center",
        autoClose: 3000,
      });
    }
  };

  if (isLoading.background || isLoading.header || isLoading.position || isLoading.rockBlue || isLoading.rockRed)
    return (
      <div className="arena-background-small">
        {" "}
        <img alt="" src={require("../../assets/pic/shield-right.png")} style={{ display: "none" }}/>
        <img alt="" src={require("../../assets/pic/shield-left.png")} style={{ display: "none" }}/>
        <img alt="" src={require("../../assets/pic/sword-left.png")} style={{ display: "none" }}/>
        <img alt="" src={require("../../assets/pic/sword-right.png")} style={{ display: "none" }}/>
        <img
          alt=""
          src={require("../../assets/pic/arena-background.png")}
          style={{ display: "none" }}
          onLoad={() => setIsLoading((prev=>{return{...prev,background: false}}))}
        />
        <img
          alt=""
          src={headerImg}
          style={{ display: "none" }}
          onLoad={() => setIsLoading((prev=>{return{...prev,header: false}}))}
        />
        <img
          alt=""
          src={require("../../assets/pic/mint-rock-blue.png")}
          style={{ display: "none" }}
          onLoad={() => setIsLoading((prev=>{return{...prev,rockBlue: false}}))}
        />
        <img
          alt=""
          src={require("../../assets/pic/mint-rock-red.png")}
          style={{ display: "none" }}
          onLoad={() => setIsLoading((prev=>{return{...prev,rockRed: false}}))}
        />
        <img
          alt=""
          src={require("../../assets/pic/header-frame.png")}
          style={{ display: "none" }}
          onLoad={() => setIsLoading((prev=>{return{...prev,position: false}}))}
        />
        <div className="loader-container" style={{ height: "35%" }}>
          <div className="loader"></div>
        </div>
      </div>
    );
  return (
    <div className="arena">
      <div className="arena-header">
        <img alt="" src={headerImg} />
        <div>ARENA</div>
      </div>
      <div className="arena-players">
        <div className="turtle-player">
          <ArenaPlayer
            type={"Turtle"}
            attacker={attacker === "Turtle"}
            player={
              playerHover?.player?.playerType === "Turtle"
                ? playerHover
                : choosenTurtle
            }
            func={() => setOnChoosePlayer("Turtle")}
            attacking={attacking}
          />
        </div>
        <div className="turtle-player">
          <ArenaPlayer
            type={"Rabbit"}
            attacker={attacker === "Rabbit"}
            player={
              playerHover?.player?.playerType === "Rabbit"
                ? playerHover
                : choosenRabbit
            }
            func={() => setOnChoosePlayer("Rabbit")}
            attacking={attacking}
          />
        </div>
      </div>
      <div className="switch-position" onClick={switchPosition}>
        <img alt="" src={switchPositionImg} />
      </div>
      <div className="arena-attack-btn">
        <MainBtn txt="ATTACK" func={attackPlayer} />
      </div>
      {onChoosePlayer && (
        <div className="outside-click" onClick={() => setOnChoosePlayer(null)}>
          <div
            className="all-players-arena"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="players-list">
              {playersData.length ? (
                getPlayersToShow().map((player, idx) => {
                  return (
                    <Player
                      key={idx}
                      player={player}
                      onClickFunc={() => choosePlayer(player)}
                      onHover={onHover}
                      height={"50%"}
                    />
                  );
                })
              ) : (
                <div className="loader-container" style={{ height: "40%" }}>
                  <div className="loader"></div>
                </div>
              )}
              {filter === "Mine" && (
                <MintNewPlayer height={"56%"} fontSize={"0.65em"} />
              )}
            </div>
            <div className="players-filter">
              {onChoosePlayer === "Turtle" && (
                <img
                  className={filter === "Turtle" ? "active" : ""}
                  alt=""
                  src={filterTurtles}
                  onClick={() => setFilter("")}
                />
              )}
              {onChoosePlayer === "Rabbit" && (
                <img
                  className={filter === "Rabbit" ? "active" : ""}
                  alt=""
                  src={filterRabbits}
                  onClick={() => setFilter("")}
                />
              )}
              <img
                className={filter === "Mine" ? "active" : ""}
                alt=""
                src={filterMyPlayers}
                onClick={() => setFilter("Mine")}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Arena;
