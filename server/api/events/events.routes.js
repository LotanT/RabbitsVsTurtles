const express = require("express");
const router = express.Router();
const { getEvents } = require("./events.controller");

router.get("/:id", getEvents);

module.exports = router;
