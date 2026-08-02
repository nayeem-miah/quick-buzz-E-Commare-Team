const express = require("express");
const { handleAiChat } = require("../controller/ai.controller");

const router = express.Router();

router.post("/chat", handleAiChat);

module.exports = router;
