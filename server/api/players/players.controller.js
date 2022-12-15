const playersService = require('./players.service')

module.exports = {
    getPlayers
}

async function getPlayers(req, res){
    try{
        const {id} = req.params
        const players = await playersService.query(id)
        res.send(players)
    } catch (err){
        console.log(err);
        res.status(500).send({err: 'Faild to get players'})
    }
}