const eventsService = require('./events.service')

module.exports = {
    getEvents,
}

async function getEvents(req, res){
    try{
        let { id } = req.params
        const events = await eventsService.query(id)
        res.send(events)
    } catch (err) {
        console.log(err);
        res.status(500).send({err: 'Faild to get events'})
    }
}

