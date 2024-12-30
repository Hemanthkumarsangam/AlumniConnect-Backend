const Chats = require('../models/chatModel');
const express = require('express');
const updtChat = express.Router();

updtChat.patch('/:id', async (req, res) => {
  const chatId = req.params.id;
  const result = await Chats.findOne({chatId})
  if(result === null){
    const chat = new Chats({chatId, chat : []})
    await chat.save()
    res.send(chat);
    return;
  }
  res.send(result)
})

module.exports = updtChat