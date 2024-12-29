const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    chatId : {
        type : 'string',
        required: true,
        unique : true
    },
    chat : [
        {
            sender : {
                type : 'string',
                required: true
            },
            reciever : {
                type : 'string',
                required: true
            },
            sentTime : {
                type : 'Date',
                required: true,
            },
            message : {
                type : 'string',
                required: true
            }
        }
    ],
})

const Chats = new mongoose.model('Chat', chatSchema)
module.exports = Chats;