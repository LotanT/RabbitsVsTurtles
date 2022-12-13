import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAllPlayers } from "../../features/playersSlice";

import "./leaderboard.css";
import blueShield from "../../assets/pic/leaderboard-shield-blue.png";
import redShield from "../../assets/pic/leaderboard-shield-red.png";
import firsFrame from "../../assets/pic/leaderboard-first-frame.png";
import oneIcon from "../../assets/pic/leaderboard-one.png";
import exitIconWhite from "../../assets/pic/exit-icon-white.png";
import { playerUpdate } from "../../features/playerToShowSlice";

const Leaderboard = ({ setIsLeaderboard }) => {
  const [playersData, setPlayersData] = useState([]);
  const players = useSelector(selectAllPlayers);
  const dispatch = useDispatch();

  useEffect(() => {
    let playersData = players.sort((a, b) => b.player[8] - a.player[8]);
    setPlayersData(playersData);
  }, [players]);

  return (
    <div className="leaderboard" onClick={(e) => e.stopPropagation()}>
      {!playersData.length ? (
        <div className="loader-container" style={{ height: "50%" }}>
          <div className="loader"></div>
        </div>
      ) : (
        <>
          <div
            className="leaderboard-exit"
            onClick={() => setIsLeaderboard(false)}
          >
            <img alt="" src={exitIconWhite} />
          </div>
          <div className="leaderboard-first">
            <div className="first-frame">
              <img alt="" src={firsFrame} />
            </div>
            <div
              className="first-image"
              onClick={() => dispatch(playerUpdate(playersData[0]))}
            >
              <img alt="" src={playersData[0]?.image} />
            </div>
            <div className="first-one">
              <img alt="" src={oneIcon} />
            </div>
            <div className="first-desc">{`${playersData[0].player[1]} - #${playersData[0].id} with: ${playersData[0].player[8]} kills`}</div>
          </div>
          <div className="leaderboard-list">
            {playersData.map((player, idx) => {
              if (!idx) return;
              return (
                <div
                  className="leaderboard-player"
                  key={idx}
                  onClick={() => dispatch(playerUpdate(player))}
                >
                  <div className="leaderboard-place">{idx + 1}</div>
                  <div className="leaderboard-img">
                    <img alt="" src={player.image} />
                  </div>
                  <div className="leaderboard-desc">{`${player.player[1]} - #${player.id}`}</div>
                  <div className="leaderboard-kills">{`with: ${player.player[8]} kills`}</div>
                  <div className="leaderboard-sheild">
                    <img
                      alt=""
                      src={
                        player.player[1] === "Turtle" ? redShield : blueShield
                      }
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Leaderboard;
