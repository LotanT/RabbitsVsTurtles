const express = require('express')
const http = require('http')
const cors = require('cors')
const path = require('path')

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('public'));

const server = http.createServer(app)

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'public')));
  } else {
    const corsOptions = {
      origin: [
        'http://127.0.0.1:3000',
        'http://localhost:3000',
        '*'
      ],
      credentials: true,
    };
    app.use(cors(corsOptions));
  }

const { connectSockets } = require('./services/socket.service');
const { startAllListeners } = require('./services/listeners.service')
const chatRoutes = require('./api/chat/chat.routes')
const eventsRoutes = require('./api/events/events.routes')

app.use('/api/chat', chatRoutes)
app.use('/api/events', eventsRoutes)
connectSockets(server)
startAllListeners()

const port = process.env.PORT || 3001;



server.listen(port, ()=>{
    console.log(`server is running on port ${port}`)
})