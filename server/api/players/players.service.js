const dbService = require('../../services/db.service')

const collectionName = 'players'

module.exports = {
    query,
    add,
    update,
    restartDB
}

async function query(id) {
    try{
        const collection = await dbService.getCollection(collectionName + id);
        let players = collection.find().toArray()
        return players
    } catch (err){
        console.log(`cant find players`, err);
        throw err
    }
}

async function add(player, id){
    try{
        const collection = await dbService.getCollection(collectionName+id)
        const addedPlayer = await collection.insertOne(player)
        return addedPlayer
    } catch (err){
        console.log(`cant add player`, err);
        throw err
    }
}

async function restartDB(players, id){
    try{
        const collection = await dbService.getCollection(collectionName+id)
        await collection.remove({})
        const addedPlayers = await collection.insertMany(players)
        return addedPlayers
    } catch (err){
        console.log(`cant add player`, err);
        throw err
    }
}

async function update(player, id){
    try{
        const collection = await dbService.getCollection(collectionName+id)
        const updatedPlayer = await collection.findOneAndUpdate({ "id": player.id }, { $set: { ...player } })
        return updatedPlayer
    } catch (err){
        console.log(`cant update player`, err);
        throw err
    }
}