import React, { useEffect, useRef, useState } from "react";
import { useWeb3React } from "@web3-react/core";

import "./confirmation-modal.css";
import exitIcon from '../../assets/pic/exit-icon.png'

const ConfirmationModal = ({desc ,closeFunc, confirmFanc, params, info}) => {

    const [estimateGasFee, setEstimateGasFee] = useState(0)
    const [isBalance, setIsBalance] = useState(true)
    const { provider } = useWeb3React();
    const intervalId = useRef(0)

    useEffect(()=>{
        getEstimateGasFee()
        intervalId.current = setInterval(getEstimateGasFee, 4000)
        // send()
        return ()=>{
          clearInterval(intervalId.current)
        }
    },[])

    const send = async ()=>{
      const txHash = await provider.getSigner().sendTransaction(params.params);
    }

    const getEstimateGasFee = async()=> {
        try{
          const estimateGasAmount = await info.web3.eth.estimateGas(params.params);
          const estimateGasPrice = await info.web3.eth.getGasPrice();
          setEstimateGasFee(info.web3.utils.fromWei(String(estimateGasAmount * estimateGasPrice * 1.1)))
        }catch(err){
            clearInterval(intervalId.current)
            setIsBalance(false)
            console.log(err);
        }
    }

    console.log(params);

  return (
    <div className="confirmation-modal">
      <div className="error-exit" onClick={closeFunc}>
        <img alt="" src={exitIcon} />
      </div>
      <div className="error-header">Confirm</div>
      <div className="confirmation-desc">Mint Warrior</div>
      <div className="estimate-cost">
        <div>Estimate Cost:</div>
        <div>
            <div>Mint cost:</div>
            <div>{params.params.value? info.web3.utils.fromWei(params.params.value) : 0}</div>
        </div>
        <div>
            <div>Gas fee:</div>
            <div>{estimateGasFee}</div>
        </div>
        <div>
            <div>Totlal:</div>
            <div>{params.params.value? Number(info.web3.utils.fromWei(params.params.value)): 0 + Number(estimateGasFee)}</div>
        </div>
        {isBalance? <div className="confirmation-btn" onClick={confirmFanc}>Confirm</div> :
        <div className="confirmation-btn enable">Insufficient MATIC balance</div>}
      </div>
    </div>
  );
};

export default ConfirmationModal;