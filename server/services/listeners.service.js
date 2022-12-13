const eventService = require('../api/events/events.service')
const playersService = require('../api/players/players.service')
const Web3 = require('web3')
const abi = require('../contract/abi.json')

const infuraKey = '9b81098f432a446690d089d65bc3deb9'

//contracts addresses
const polygonAddress = '0x829a67EF339E6230FcfDbf3c8730fFBb0329e796'
const goerliAddress = '0xE7efc0e6Bf6A12F52cf725A3A164eEd8a9292237'

const web3Goerli = new Web3(`https://goerli.infura.io/v3/${infuraKey}`)
const web3Polygon = new Web3(`https://polygon-mainnet.infura.io/v3/${infuraKey}`)

const web3wsPolygon = new Web3(`wss://polygon-mainnet.g.alchemy.com/v2/2arFR52wPyKbFgPTwclErfm31zuLIW-y`);
const web3wsGoerli = new Web3(`wss://eth-goerli.g.alchemy.com/v2/A4cu_U64cbZ_lySFcSxT73Q4N_ZQZChC`);

module.exports = {
    startAllListeners
}

function startAllListeners(){
    startListener(abi.abi, polygonAddress, web3wsPolygon, web3Polygon)
    startListener(abi.abi, goerliAddress, web3wsGoerli, web3Goerli)
}

function startListener(abi, address, web3ws, web3){
    const contractWS = new web3ws.eth.Contract(abi, address);
    const contract = new web3.eth.Contract(abi, address);
    const options = {
        filter: {
            value: [],
        },
        fromBlock: 'latest',
    };
    console.log(contract._address);
    contractWS.events.allEvents(options).on("data", (event) => {
        console.log(event);
        eventService.add(event)
        eventAction(contract, web3, event)
    });
}

async function updatePlayer (contract, playerId, isNew = false) {
    const newPlayer = await Promise.all([
        contract.methods.tokenURI(playerId).call(),
        contract.methods.ownerOf(playerId).call(),
        contract.methods.getPlayerByIndex(playerId).call(),
    ]);
    const json = atob(newPlayer[0].substring(29));
    const result = JSON.parse(json);
    const newPlayerData = {
        id: newPlayer[2].name.split("#")[1],
        image: result.image,
        player: newPlayer[2],
        owner: newPlayer[1],
    };
    if(isNew) playersService.add(newPlayerData, contract._address)
    else playersService.update(newPlayerData, contract._address)
}

async function eventAction (contract, web3, event) {
    let currBlock = await web3.eth.getBlockNumber()
    while(event.blockNumber >= currBlock){
        currBlock = await web3.eth.getBlockNumber()
    }
    switch (event.event) {
        case 'Attacked':
            await updatePlayer(contract, event.returnValues._eaterId)
            await updatePlayer(contract, event.returnValues._eatenId)
            break;
            case 'Transfer':
                if(event.returnValues.from === "0x0000000000000000000000000000000000000000"){
                    await updatePlayer(contract, event.returnValues.tokenId, true)
                }else{
                    await updatePlayer(contract, event.returnValues.tokenId)
                }
                break;
                case 'AttackIncreased':
                    await updatePlayer(contract, event.returnValues._playerId)
                    break;
                    case 'ArmorIncreased':
                        await updatePlayer(contract, event.returnValues._playerId)     
                        break;
                        case 'DefenseIncreased':
                            await updatePlayer(contract, event.returnValues._playerId)
                            break;
                            case 'StaminaIncreased':
              await updatePlayer(contract, event.returnValues._playerId)           
              break;
              case 'Revived':
              await updatePlayer(contract, event.returnValues._playerId)
              break;
          default:
            break;
        }
}

// resetPlayersDB(web3Polygon, new web3Polygon.eth.Contract(abi.abi, polygonAddress)) //reset polygon players
// resetPastEvents(web3Polygon, new web3Polygon.eth.Contract(abi.abi, polygonAddress), 29274986) //reset polygon events

// resetPlayersDB(web3Goerli, new web3Goerli.eth.Contract(abi.abi, goerliAddress)) //reset goerli players
// resetPastEvents(web3Goerli, new web3Goerli.eth.Contract(abi.abi, goerliAddress), 8029372) //reset events players

async function resetPlayersDB(web3, contract){
    console.log(contract._address);
    const request = [];
    const playersData = [];
    let result;
    try {
        result = await web3.eth.call({
            to: contract._address,
        data: contract.methods.totalSupply().encodeABI(),
      });
    } catch (err) {
      console.log(err);
    }
    const totalSupply = web3.utils.hexToNumberString(result);
    for (let i = 1; i <= totalSupply; i++) {
      request.push(
        Promise.all([
          contract.methods.tokenURI(i).call(),
          contract.methods.ownerOf(i).call(),
          contract.methods.getPlayerByIndex(i).call(),
        ])
      );
    }
    let allData;
    try {
      allData = await Promise.all(request);
    } catch (err) {
      console.log(err);
    }
    for (let i = 0; i < allData.length; i++) {
      const json = atob(allData[i][0].substring(29));
      const result = JSON.parse(json);
      playersData.push({
        id: allData[i][2].name.split("#")[1],
        image: result.image,
        player: allData[i][2],
        owner: allData[i][1],
      });
    }
    playersService.restartDB(playersData, contract._address);
    console.log(playersData.length);
}

async function resetPastEvents(web3, contract, block){
    const currBlock = await web3.eth.getBlockNumber();
    const gap = 3499;
    let requests = [];
    console.log(block , currBlock);
    while (block < currBlock) {
      requests.push(
        contract.getPastEvents("allEvents", {
          fromBlock: block,
          toBlock: block + gap,
        })
      );
      block += gap;
    }
    const pastEvents = await Promise.all(requests);
    let allPastEvents = []
    for (let i = pastEvents.length; i > 0; i--) {
        allPastEvents = [...allPastEvents, ...pastEvents[i - 1]];
    }
    allPastEvents.sort((a, b) => b.blockNumber - a.blockNumber);
    await eventService.restartDB(allPastEvents, contract._address)
    console.log('events reset!');
}