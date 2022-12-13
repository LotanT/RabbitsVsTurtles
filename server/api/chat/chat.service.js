const dbService = require("../../services/db.service");

const collectionName = "chat";

module.exports = {
    query,
    add
}

async function query(filterBy = {}) {
  try {
    let chats = {}
    let collection = await dbService.getCollection(`${collectionName}Rabbit`);
    chats['Rabbit'] = await collection.find().toArray();
    collection = await dbService.getCollection(`${collectionName}Turtle`);
    chats['Turtle'] = await collection.find().toArray();
    collection = await dbService.getCollection(`${collectionName}General`);
    chats['General'] = await collection.find().toArray();
    collection = await dbService.getCollection(`${collectionName}Announcements`);
    chats['Announcements'] = await collection.find().toArray();
    return chats;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function add(message){
    try{
        const collection = await dbService.getCollection(`${collectionName}${message.room}`)
        const addedMessage = await collection.insertOne(message)
        return addedMessage
    } catch (err) {
        console.log(err);
        throw err
    }
}