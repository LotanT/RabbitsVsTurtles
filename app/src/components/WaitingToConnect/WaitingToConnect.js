import React, { useEffect } from 'react'
import { useWeb3React } from '@web3-react/core';

import './waiting-to-connect.css'
import exitIcon from "../../assets/pic/exit-icon.png";

const WaitingToConnect = ({closeFunction,header,subHeader,orangetxt,footer,loadingUp = false}) => {

  const {account} = useWeb3React()

  useEffect(()=>{
    if(account){
      if(account && footer) closeFunction()
    } 
  },[account])

  return (
    <div className='waiting-connect'>
        {closeFunction && <div className='modal-exit' onClick={closeFunction}><img alt='' src={exitIcon}/></div>}
        {loadingUp &&<div className='lds-ring'><div></div><div></div><div></div></div>}
        <div>
        {header && <div className='waiting-header'>{header}</div>}
        {subHeader && <div className='waiting-subheader'>{subHeader}</div>}
        </div>
        {!loadingUp &&<div className='lds-ring'><div></div><div></div><div></div></div>}
        {orangetxt && <div className='waiting-orange-txt'>{orangetxt}</div>}
        {footer && <div className='waiting-footer'>{footer}</div>}
    </div>
  )
}

export default WaitingToConnect
