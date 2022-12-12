const eventService = require('../api/events/events.service')
const Web3 = require('web3')
const abi = require('../contract/abi.json')

const infuraKey = '9b81098f432a446690d089d65bc3deb9'

//contracts addresses
const polygonAddress = '0x829a67EF339E6230FcfDbf3c8730fFBb0329e796'
const goerliAddress = '0xE7efc0e6Bf6A12F52cf725A3A164eEd8a9292237'

const web3wsPolygon = new Web3(`wss://polygon-mainnet.g.alchemy.com/v2/2arFR52wPyKbFgPTwclErfm31zuLIW-y`);
const web3wsGoerli = new Web3(`wss://eth-goerli.g.alchemy.com/v2/A4cu_U64cbZ_lySFcSxT73Q4N_ZQZChC`);

module.exports = {
    startAllListeners
}

function startAllListeners(){
    startListener(abi.abi, polygonAddress, web3wsPolygon)
    startListener(abi.abi, goerliAddress, web3wsGoerli)
}

function startListener(abi, address, web3){
    const contract = new web3.eth.Contract(abi, address);
    const options = {
        filter: {
            value: [],
        },
        fromBlock: 'latest',
    };
    console.log('hi');
    contract.events.allEvents(options).on("data", (event) => {
        console.log(event);
        eventService.add(event)
    });
}