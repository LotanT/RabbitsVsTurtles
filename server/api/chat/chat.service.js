const dbService = require("../../services/db.service");

const collectionName = "chat";

module.exports = {
    query,
    add
}

async function query(id) {
  try {
    let chats = {}
    let collection = await dbService.getCollection(`${collectionName+id}Rabbit`);
    chats['Rabbit'] = await collection.find().toArray();
    collection = await dbService.getCollection(`${collectionName+id}Turtle`);
    chats['Turtle'] = await collection.find().toArray();
    collection = await dbService.getCollection(`${collectionName+id}General`);
    chats['General'] = await collection.find().toArray();
    collection = await dbService.getCollection(`${collectionName+id}Announcements`);
    chats['Announcements'] = await collection.find().toArray();
    return chats;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function add(id, message){
    try{
        const collection = await dbService.getCollection(`${collectionName+id}${message.room}`)
        const addedMessage = await collection.insertOne(message)
        return addedMessage
    } catch (err) {
        console.log(err);
        throw err
    }
}