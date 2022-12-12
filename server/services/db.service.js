// const MongoClient = require('mongodb').MongoClient
const { MongoClient, ServerApiVersion } = require('mongodb');

module.exports = {
    getCollection,
    connect
}

const dbName = 'RVT_DB'
const dbURL = "mongodb+srv://lotan:lotanlotan@cluster0.o05se.mongodb.net/?retryWrites=true&w=majority";

var dbConn = null

async function getCollection(collectionName) {
    try {
        const db = await connect()
        const collection = await db.collection(collectionName)
        return collection
    } catch (err) {
        logger.error('Failed to get Mongo collection', err)
        throw err
    }
}

async function connect() {
    if (dbConn) return dbConn
    try {
        // const client = await MongoClient.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
        const client = new MongoClient(dbURL, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
        client.connect()
        const db = client.db(dbName)
        dbConn = db
        console.log('connect to Mongo');
        return db
    } catch (err) {
        console.log('Cannot Connect to DB', err)
        throw err
    }
}