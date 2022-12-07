import { TorusParams } from '@toruslabs/torus-embed'
import type {
Actions,
AddEthereumChainParameter,
Provider,
ProviderConnectInfo,
ProviderRpcError,
} from '@web3-react/types'

import { Connector } from '@web3-react/types'

interface TorusConnectorArguments {
chainId: number
initOptions?: TorusParams
constructorOptions?: TorusCtorArgs
loginOptions?: any
}
interface TorusCtorArgs {
buttonPosition?: 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left'
}

export class TorusConnector extends Connector {
/** {@inheritdoc Connector.provider} */
public provider: Provider | undefined
private readonly chainId: number
private readonly initOptions: TorusParams
private readonly constructorOptions: TorusCtorArgs
private readonly loginOptions: any
public torus: any
constructor(
actions: Actions,
{ chainId, constructorOptions = {}, initOptions = {} }: TorusConnectorArguments ) {
super(actions)
this.chainId = chainId
this.constructorOptions = constructorOptions
this.initOptions = initOptions
}
// the connected property, is bugged, but this works as a hack to check connection status
public async activate(): Promise {
this.actions.startActivation()
if (!this.provider) {
const Torus = await import('@toruslabs/torus-embed').then((m) => m?.default ?? m)
this.torus = new Torus(this.constructorOptions)
await this.torus.init(this.initOptions)
await this.torus.ethereum.enable()
this.provider = this.torus.ethereum
}
if (this.provider)
return Promise.all([this.provider.request({ method: 'eth_accounts' }) as Promise<string[]>])
.then(([accounts]) => {
if (accounts.length) {
this.actions.update({ chainId: parseChainId(this.chainId), accounts })
} else {
this.actions.reportError(new Error('No accounts returned'))
}
})
.catch((error) => {
console.debug('Could not connect eagerly', error)
this.actions.startActivation()
})
}
}
function parseChainId(chainId: string | number) {
return typeof chainId === 'number' ? chainId : Number.parseInt(chainId, chainId.startsWith('0x') ? 16 : 10)
}