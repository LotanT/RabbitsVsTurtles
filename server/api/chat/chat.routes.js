const express = require('express')
const router = express.Router()
const {getAllChats} = require('./chat.controller')

router.get('/', getAllChats)

module.exports = router;