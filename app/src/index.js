import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Web3ReactProvider } from "@web3-react/core";
import { HashRouter } from "react-router-dom";
import { ThirdwebProvider, ChainId } from "@thirdweb-dev/react";
// import {
//   networkConnection,
//   injectedConnection,
//   walletConnectConnection,
//   coinbaseWalletConnection,
// } from "./connectors/connections";
import { Web3Provider } from '@ethersproject/providers'
import Web3 from "web3";

import { Buffer } from "buffer";
import { Provider } from "react-redux";
import { store } from "./features/store";

function getLibrary(provider) {
  // var library
  //   library = new Web3Provider(provider)
  //   library.pollingInterval = 12000
  // }

  // return new Web3Provider(provider)
  return new Web3(provider)
}

// const connectors = [
//   [injectedConnection.connector, injectedConnection.hooks],
//   [walletConnectConnection.connector, walletConnectConnection.hooks],
//   [coinbaseWalletConnection.connector, coinbaseWalletConnection.hooks],
//   [networkConnection.connector, networkConnection.hooks],
// ];

window.Buffer = window.Buffer || Buffer;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
    <ThirdwebProvider>
    <Provider store={store}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <HashRouter>
          <App />
        </HashRouter>
      </Web3ReactProvider>
    </Provider>
    </ThirdwebProvider>
  // </React.StrictMode>
);

reportWebVitals();
