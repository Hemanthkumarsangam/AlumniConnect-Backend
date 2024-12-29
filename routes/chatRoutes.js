const Chats = require('../models/chatModel');
const express = require('express');
const updtChat = express.Router();

updtChat.get('/getChat/:id', async (req, res) => {
  const chatId = req.params.id;
  const result = await Chats.findOne({chatId})
  res.send(result)
})

module.exports = updtChat