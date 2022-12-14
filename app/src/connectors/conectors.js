import { InjectedConnector } from '@web3-react/injected-connector'
import { NetworkConnector } from '@web3-react/network-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { FortmaticConnector } from '@web3-react/fortmatic-connector'
import { TorusConnector } from '@web3-react/torus-connector'

const POLLING_INTERVAL = 12000
const RPC_URLS = {
  137: process.env.RPC_URL_137,
  5: process.env.RPC_URL_5
}

export const injected = new InjectedConnector({ supportedChainIds: [137,5] })

export const network = new NetworkConnector({
  urls: { 137: RPC_URLS[137], 5: RPC_URLS[5] },
  defaultChainId: 137
})

export const walletconnect = new WalletConnectConnector({
  rpc: { 137: RPC_URLS[137] },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: POLLING_INTERVAL
})

// export const walletlink = new WalletLinkConnector({
//   url: RPC_URLS[1],
//   appName: 'web3-react example'
// })

// export const ledger = new LedgerConnector({ chainId: 1, url: RPC_URLS[1], pollingInterval: POLLING_INTERVAL })

// export const trezor = new TrezorConnector({
//   chainId: 1,
//   url: RPC_URLS[1],
//   pollingInterval: POLLING_INTERVAL,
//   manifestEmail: 'dummy@abc.xyz',
//   manifestAppUrl: 'http://localhost:1234'
// })

// export const frame = new FrameConnector({ supportedChainIds: [1] })

// export const authereum = new AuthereumConnector({ chainId: 42 })

export const fortmatic = new FortmaticConnector({ apiKey: process.env.FORTMATIC_API_KEY, chainId: 137 })

// export const magic = new MagicConnector({
//   apiKey: process.env.MAGIC_API_KEY as string,
//   chainId: 4,
//   email: 'hello@example.org'
// })

// export const portis = new PortisConnector({ dAppId: process.env.PORTIS_DAPP_ID as string, networks: [1, 100] })

// export const squarelink = new SquarelinkConnector({
//   clientId: process.env.SQUARELINK_CLIENT_ID as string,
//   networks: [1, 100]
// })

export const torus = new TorusConnector({ chainId: 137 })

// export const onewallet = new OneWalletConnector({ chainId: 1 })

// export const mathwallet = new MathWalletConnector({ chainId: 1 })
