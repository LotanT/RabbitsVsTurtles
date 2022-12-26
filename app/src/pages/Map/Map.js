import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'

import './map.scss'


const Map = ({isAudio}) => {
  
  const [isLoading, setIsLoading] = useState(true);
  const audio = new Audio(require('../../assets/music/Dramatic - Map.mp3'))
  audio.loop = true
  

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

  const getSnow = ()=>{
    const numOfSnow = 100;
    let snow = []
    for(let i=0; i< numOfSnow; i++){
        snow.push(<div className='snowflake'/>)
    }
    return snow
  }
  
  if(isLoading) return <div className="map-background-small"> <img alt="" src={require("../../assets/pic/game-map.png")} style={{display: 'none'}} onLoad={() => setIsLoading(false)}/><div className="loader-container" style={{height: '35%'}}><div className="loader"></div></div></div>
  return (
    <div className='map'>
      <div>
       <div className='map-rabbit-jumping'><img alt='' src={require('../../assets/pic/gif-giphy.gif')}/></div>
       <div className='map-rabbit-jumping2'><img alt='' src={require('../../assets/pic/gif-giphy.gif')}/></div>
       <div className='map-turtle-walking'><img alt='' src={require('../../assets/pic/gif-turtle-walking.gif')}/></div>
       <div className='map-turtle-dancing'><img alt='' src={require('../../assets/pic/gif-turtle-dance.gif')}/></div>
       <div className='map-smoke-many1'><img alt='' src={require('../../assets/pic/gif-smoke-many.gif')}/></div>
       <div className='map-smoke-many2'><img alt='' src={require('../../assets/pic/gif-smoke-many.gif')}/></div>
       <div className='map-smoke-many3'><img alt='' src={require('../../assets/pic/gif-smoke-many.gif')}/></div>
       <div className='map-dolphine1'><img alt='' src={require('../../assets/pic/gif-dolphine-jump.gif')}/></div>
       <div className='map-dolphine2'><img alt='' src={require('../../assets/pic/gif-dolphine-small-jump.gif')}/></div>
       <div className='map-bird'><img alt='' src={require('../../assets/pic/gif-eagle-flying.gif')}/></div>
       <div className='map-circle-birds'><div className='map-bird2'><img alt='' src={require('../../assets/pic/gif-flying-birds.gif')}/></div></div>
      </div>
      <div className='map-rabbit-nft2'><img alt='' src={require('../../assets/pic/mint-rubbit.png')}/></div>
      <div>
       <div className='map-rabbit-nft'><img alt='' src={require('../../assets/pic/mint-rubbit.png')}/></div>
       <div className='map-rabbit-nft'><img alt='' src={require('../../assets/pic/mint-rubbit.png')}/></div>
       <div className='map-rabbit-nft'><img alt='' src={require('../../assets/pic/mint-rubbit.png')}/></div>
      </div>
      <div>
       <div className='map-turtle-nft'><img alt='' src={require('../../assets/pic/mint-turtle.png')}/></div>
       <div className='map-turtle-nft'><img alt='' src={require('../../assets/pic/mint-turtle.png')}/></div>
       <div className='map-turtle-nft'><img alt='' src={require('../../assets/pic/mint-turtle.png')}/></div>
       <div className='map-turtle-nft'><img alt='' src={require('../../assets/pic/mint-turtle.png')}/></div>
      </div>
      <div>
        {getSnow()}
      </div>
    </div>
  )
}

export default Map