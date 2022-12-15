import React, { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { selectAllPlayers } from "../../features/playersSlice";
import { useSelector } from "react-redux";
import { selectAllInfo } from "../../features/infoSlice";

import "./shop.css";
import Introduction from "../../components/Introduction/Introduction";
import Product from "../../components/Product/Product";
import ChoosePlayer from "../../components/ChoosePlayer/ChoosePlayer";
import UpgradeConfirm from "../../components/UpgradeConfirm/UpgradeConfirm";
import { toast, Flip } from "react-toastify";
import { useParams } from "react-router-dom";

const Shop = ({ confirmTransaction, isAudio }) => {
  const products = {
    regular: {
      header: "Store",
      products: [
        {
          header: "Attack",
          productImg: "potion-green",
          price: 5,
          desc: "+5 Attack",
        },
        {
          header: "Defence",
          productImg: "potion-blue",
          price: 5,
          desc: "+5 Defence",
        },
        {
          header: "Stamina",
          productImg: "potion-red",
          price: 10,
          desc: "+20 Attack",
        },
        {
          header: "Armor",
          productImg: "potion-yellow",
          price: 10,
          desc: "+20 Attack",
        },
      ],
    },
    books: {
      header: "Wisdom Library",
      products: [
        {
          header: "Attack",
          productImg: "book-green",
          price: 5,
          desc: "+5 Attack",
        },
        {
          header: "Defence",
          productImg: "book-blue",
          price: 5,
          desc: "+5 Defence",
        },
        {
          header: "Stamina",
          productImg: "book-red",
          price: 10,
          desc: "+20 Attack",
        },
        {
          header: "Armor",
          productImg: "book-yellow",
          price: 10,
          desc: "+20 Attack",
        },
      ],
    },
    hats: {
      header: "Witch Valley",
      products: [
        {
          header: "Attack",
          productImg: "hat-brown",
          price: 5,
          desc: "+5 Attack",
        },
        {
          header: "Defence",
          productImg: "hat-red",
          price: 5,
          desc: "+5 Defence",
        },
        {
          header: "Stamina",
          productImg: "hat-purple",
          price: 10,
          desc: "+20 Attack",
        },
        {
          header: "Armor",
          productImg: "hat-green",
          price: 10,
          desc: "+20 Attack",
        },
      ],
    },
    shields: {
      header: "The Chapel",
      products: [
        {
          header: "Attack",
          productImg: "armor-red",
          price: 5,
          desc: "+5 Attack",
        },
        {
          header: "Defence",
          productImg: "armor-green",
          price: 5,
          desc: "+5 Defence",
        },
        {
          header: "Stamina",
          productImg: "armor-purple",
          price: 10,
          desc: "+20 Attack",
        },
        {
          header: "Armor",
          productImg: "armor-yellow",
          price: 10,
          desc: "+20 Attack",
        },
      ],
    },
    crowns: {
      header: "The Palace",
      products: [
        {
          header: "Attack",
          productImg: "crown-gold-blue",
          price: 5,
          desc: "+5 Attack",
        },
        {
          header: "Defence",
          productImg: "crown-gold-red",
          price: 5,
          desc: "+5 Defence",
        },
        {
          header: "Stamina",
          productImg: "crown-silver-blue",
          price: 10,
          desc: "+20 Attack",
        },
        {
          header: "Armor",
          productImg: "crown-silver-red",
          price: 10,
          desc: "+20 Attack",
        },
      ],
    },
    keys: {
      header: "The Vault",
      products: [
        {
          header: "Attack",
          productImg: "key-gold",
          price: 5,
          desc: "+5 Attack",
        },
        {
          header: "Defence",
          productImg: "key-pink",
          price: 5,
          desc: "+5 Defence",
        },
        {
          header: "Stamina",
          productImg: "key-blue",
          price: 10,
          desc: "+20 Attack",
        },
        {
          header: "Armor",
          productImg: "key-silver",
          price: 10,
          desc: "+20 Attack",
        },
      ],
    },
    veggies: {
      header: "Megical Veggies",
      products: [
        { header: "Attack", productImg: "carrot", price: 5, desc: "+5 Attack" },
        {
          header: "Defence",
          productImg: "plant",
          price: 5,
          desc: "+5 Defence",
        },
        {
          header: "Stamina",
          productImg: "adamame",
          price: 10,
          desc: "+20 Attack",
        },
        {
          header: "Armor",
          productImg: "small-radish",
          price: 10,
          desc: "+20 Attack",
        },
      ],
    },
  };

  const character = { url: "magition", top: "-2%", left: "86%" };

  const mintInfo = {
    increaseAttackCost: "5000000000000000000", // 5 Matic
    increaseDefenseCost: "5000000000000000000", // 5 Matic
    increaseStaminaCost: "10000000000000000000", // 10 Matic
    increaseArmorCost: "10000000000000000000", // 10 Matic
    revivePlayerCost: "500000000000000000000", // 500 Matic
  };

  const [activeStage, setActiveStage] = useState("store");
  const [choosenPlayer, setChoosenPlayer] = useState();
  const [choosenUpgrade, setChoosenUpgrade] = useState();
  const [playersData, setPlayersData] = useState(null);
  const [isLoading, setIsLoading] = useState({productFrame: true, background: true, frame: true});
  const { accounts } = useWeb3React();
  const players = useSelector(selectAllPlayers);
  const info = useSelector(selectAllInfo);
  const { type } = useParams();
  const shopType = type ? type : "regular";
  const audio = new Audio(require("../../assets/music/Adventure - Store.mp3"));
  audio.loop = true;

  useEffect(() => {
    let filterPlayers = players.filter((player) => {
      if (choosenPlayer?.id === player.id) setChoosenPlayer(player);
      return player.player[4];
    });
    setPlayersData(filterPlayers);
  }, [players]);

  useEffect(() => {
    setIsLoading({productFrame: true, background: true, frame: true})
    resetState()
  }, [type]);

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

  const setChoosen = (choosen) => {
    if (typeof choosen === "number") {
      setChoosenUpgrade(choosen);
      if (!choosenPlayer) setActiveStage("choosePlayer");
      else setActiveStage("confirmUpgrade");
    } else {
      setChoosenPlayer(choosen);
      if (choosenUpgrade === undefined) setActiveStage("store");
      else setActiveStage("confirmUpgrade");
    }
  };

  const resetState = () => {
    setChoosenPlayer("");
    setChoosenUpgrade("");
    setActiveStage("store");
  };

  const buyUpgrade = async () => {
    if(accounts && accounts.length){
    let desc = {};
    const params = {
      to: info.contractJSON.address,
      from: accounts[0],
      value: "",
      data: "",
    };
    switch (choosenUpgrade) {
      case 0:
        params.value = String(
          info.web3.utils.toHex(Number(mintInfo.increaseAttackCost))
        );
        params.data = info.contract.methods
          .increaseAttack(Number(choosenPlayer.player[0].split("#")[1]))
          .encodeABI();
        desc.action = "Increase Attack";
        desc.txt = `You are about to give player number #${
          choosenPlayer.player[0].split("#")[1]
        } attack potion.`;
        desc.img = choosenPlayer.image;
        desc.symbol = products[shopType].products[0].productImg;
        break;
      case 1:
        params.value = String(
          info.web3.utils.toHex(Number(mintInfo.increaseDefenseCost))
        );
        params.data = info.contract.methods
          .increaseDefense(Number(choosenPlayer.player[0].split("#")[1]))
          .encodeABI();
        desc.action = "Increase Defence";
        desc.txt = `You are about to give player number #${
          choosenPlayer.player[0].split("#")[1]
        } Defence potion.`;
        desc.img = choosenPlayer.image;
        desc.symbol = products[shopType].products[1].productImg;
        break;
      case 2:
        params.value = String(
          info.web3.utils.toHex(Number(mintInfo.increaseStaminaCost))
        );
        params.data = info.contract.methods
          .increaseStamina(Number(choosenPlayer.player[0].split("#")[1]))
          .encodeABI();
        desc.action = "Increase Stamina";
        desc.txt = `You are about to give player number #${
          choosenPlayer.player[0].split("#")[1]
        } Stamina potion.`;
        desc.img = choosenPlayer.image;
        desc.symbol = products[shopType].products[2].productImg;
        break;
      case 3:
        params.value = String(
          info.web3.utils.toHex(Number(mintInfo.increaseArmorCost))
        );
        params.data = info.contract.methods
          .increaseArmor(Number(choosenPlayer.player[0].split("#")[1]))
          .encodeABI();
        desc.action = "Increase Armor";
        desc.txt = `You are about to give player number #${
          choosenPlayer.player[0].split("#")[1]
        } Armor potion.`;
        desc.img = choosenPlayer.image;
        desc.symbol = products[shopType].products[3].productImg;
        break;
      default:
        return;
    }
    const res = await confirmTransaction(params, desc);
    if (res) {
      toast.info("Insufficient funds", {
        position: "bottom-left",
        autoClose: 3000,
        transition: Flip,
      });
    }
  }else{
    toast.info('Connect your wallet')
  }
  };

  if (isLoading.background || isLoading.frame || isLoading.productFrame)
    return (
      <div className="shop-background-small"
      style={
        type && type !== 'regular'
          ? {
              background: `url(${require(`../../assets/pic/shop-${shopType}-background-small.png`)})`,
            }
          : {}
      }>
        {" "}
        <img
          alt=""
          src={type && type !== 'regular'
          ?require(`../../assets/pic/shop-${shopType}-background.png`)
          :require(`../../assets/pic/shop-background.png`)}
          style={{ display: 'none' }}
          onLoad={() => setIsLoading((prev=>{return{...prev,background: false}}))}
        />
        <img
          alt=""
          src={require(`../../assets/pic/frame.png`)}
          style={{ display: 'none' }}
          onLoad={() => setIsLoading((prev=>{return{...prev,frame: false}}))}
        />
        <img
          alt=""
          src={require(`../../assets/pic/product-frame.png`)}
          style={{ display: 'none' }}
          onLoad={() => setIsLoading((prev=>{return{...prev,productFrame: false}}))}
        />
        <div className="loader-container" style={{ height: "35%" }}>
          <div className="loader"></div>
        </div>
      </div>
    );
  return (
    <div
      className="shop"
      style={
        type && type !== 'regular'
          ? {
              background: `url(${require(`../../assets/pic/shop-${shopType}-background.png`)})`,
            }
          : {}
      }
    >
      {activeStage === "introduction" && (
        <Introduction
          header={"STORE"}
          btnTxt={`LET'T GO`}
          txt={
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Id ut rutrum metus neque enim, maecenas. Nibh nulla urna iaculis phasellus. Sed non in accumsan, nulla id. Vitae pharetra hendrerit id volutpat mi vitae nibh."
          }
        />
      )}
      {activeStage === "store" && (
        <div className="products-frame">
          <div
            className="character"
            style={{ top: character.top, left: character.left }}
          >
            <img
              alt=""
              src={require(`../../assets/pic/${character.url}.png`)}
            />
          </div>
          <div className="shop-frame-header">{products[shopType].header}</div>
          <div className="product-list">
            {products[shopType].products.map((product, idx) => {
              return (
                <Product
                  key={product.header}
                  header={product.header}
                  productImg={product.productImg}
                  price={product.price}
                  func={() => setChoosen(idx)}
                  height="45%"
                  btnTxt={"Select"}
                  desc={product.desc}
                />
              );
            })}
          </div>
        </div>
      )}
      {activeStage === "choosePlayer" && (
        <ChoosePlayer playersData={playersData} setChoosen={setChoosen} />
      )}
      {activeStage === "confirmUpgrade" && (
        <UpgradeConfirm
          player={choosenPlayer}
          product={products[shopType].products[choosenUpgrade]}
          setActiveStage={setActiveStage}
          resetState={resetState}
          buyUpgrade={buyUpgrade}
        />
      )}
    </div>
  );
};

export default Shop;
