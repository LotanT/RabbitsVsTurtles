const chatService = require('./chat.service')

module.exports = {
    getAllChats,
    addMessage
}

async function getAllChats(req, res){
    try{
        const {id} = req.params
        const chats = await chatService.query(id)
        res.send(chats)
    } catch (err) {
        console.log(err);
        res.status(500).send({err: 'Faild to get chats'})
    }
}

async function addMessage(req, res) {
    try{
        const message = req.body
        await chatService.add(message)
        res.json(message)
    } catch (err) {
        console.log(err);
        res.status(500).send({err: 'Fail to add message'})
    }
}