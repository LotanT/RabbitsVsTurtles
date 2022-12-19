import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { network, injected, walletconnect, torus, coinbaseWallet } from "./conectors";
import { useSelector } from "react-redux";
import { selectAllInfo } from "../features/infoSlice";

export function useEagerConnect() {
  const { activate, active } = useWeb3React();

  const [tried, setTried] = useState(false);

  useEffect(() => {
    injected.isAuthorized().then((isAuthorized) => {
      if (isAuthorized) {
        activate(injected, undefined, true).catch(() => {
          setTried(true);
        });
      } else {
        setTried(true);
      }
    });
  }, []); // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && active) {
      setTried(true);
    }
  }, [tried, active]);

  return tried;
}

function useConnectiton() {
  const { activate, chainId } = useWeb3React();
  return {
    Connect: async (connectionName) => {
      if(!connectionName) connectionName = 'Network'
      console.log(connectionName);
      const connectorToConnect = getConnectorByName(connectionName);
      console.log(chainId, connectorToConnect);
      await activate(connectorToConnect);
    },
  };
}
export default useConnectiton;

export async function switchNetwork(chainId, web3, connector) {
  if (window.ethereum.networkVersion !== chainId) {
    console.log('switching', chainId,web3);
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: web3.utils.toHex(chainId) }],
      });
    } catch (err) {
      // This error code indicates that the chain has not been added to MetaMask
      console.log(err);
      if (err.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainName: "Polygon Mainnet",
              chainId: web3.utils.toHex(chainId),
              nativeCurrency: { name: "MATIC", decimals: 18, symbol: "MATIC" },
              rpcUrls: ["https://polygon-rpc.com/"],
            },
          ],
        });
      } else {
        return err
      }
    }
  }
}

export function useInactiveListener(suppress = false) {
  const { active, error, activate } = useWeb3React();

  useEffect(() => {
    const { ethereum } = window;
    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleConnect = () => {
        console.log("Handling 'connect' event");
        activate(injected);
      };
      const handleChainChanged = (chainId) => {
        console.log("Handling 'chainChanged' event with payload", chainId);
        activate(injected);
      };
      const handleAccountsChanged = (accounts) => {
        console.log("Handling 'accountsChanged' event with payload", accounts);
        if (accounts.length > 0) {
          activate(injected);
        }
      };
      const handleNetworkChanged = (networkId) => {
        console.log("Handling 'networkChanged' event with payload", networkId);
        activate(injected);
      };

      ethereum.on("connect", handleConnect);
      ethereum.on("chainChanged", handleChainChanged);
      ethereum.on("accountsChanged", handleAccountsChanged);
      ethereum.on("networkChanged", handleNetworkChanged);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener("connect", handleConnect);
          ethereum.removeListener("chainChanged", handleChainChanged);
          ethereum.removeListener("accountsChanged", handleAccountsChanged);
          ethereum.removeListener("networkChanged", handleNetworkChanged);
        }
      };
    }
  }, [active, error, suppress, activate]);
}

export function getConnectorByName(name) {
  switch (name) {
    case ConnectionType.INJECTED:
      return injected;
    case ConnectionType.COINBASE_WALLET:
      return coinbaseWallet;
    case ConnectionType.WALLET_CONNECT:
      return walletconnect;
    case ConnectionType.NETWORK:
      return network;
    case ConnectionType.TORUS:
      return torus;
  }
}

const ConnectionType = {
  INJECTED: "MetaMask",
  COINBASE_WALLET: "CoinbaseWallet",
  WALLET_CONNECT: "WalletConnect",
  NETWORK: "Network",
  GNOSIS_SAFE: "GNOSIS_SAFE",
  TORUS: "Torus",
};
