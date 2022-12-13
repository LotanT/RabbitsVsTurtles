const express = require("express");
const router = express.Router();
const { getPlayers } = require("./players.controller");

router.get("/:id", getPlayers);

module.exports = router;