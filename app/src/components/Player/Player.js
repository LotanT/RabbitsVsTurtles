import React from 'react'

import './player.css'

const Player = ({player, onClickFunc, height, onHover}) => {

  const getStyle = (player) => {
    if (player.player[1] === "Turtle")
      return {
        background:
          "linear-gradient(96.47deg, #BF4040 0.9%, #CC6677 52.96%, #BF406A 98.8%)",
      };
    else
      return {
        background:
          "linear-gradient(277.43deg,#0055ff 3.63%,#3355ff 38.08%,#1500ff 96.03%)",
      };
  };
  return (
        <div
          className="player-display"
          onClick={onClickFunc}
          onMouseEnter={onHover?()=>onHover(player):()=>{}}
          onMouseLeave={onHover?()=>onHover(null):()=>{}}
          style={{height}}
        >
          <img alt="" src={player.image} />
          <div
            className="player-display-name"
            style={getStyle(player)}
          >{`#${player.player[0].split("#")[1]}`}</div>
        </div>
      )
}

export default Player