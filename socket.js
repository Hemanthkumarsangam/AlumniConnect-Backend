const { Server } = require('socket.io');  
const Chats = require('./models/chatModel');  

const socketHandler = (server) => {  
  const io = new Server(server, {  
    cors: {  
      origin: '*',  
    },  
  });  

  const userToSocketMap = {};  

  io.on('connection', (socket) => {  
    socket.on('registerUser', (userId) => {  
      userToSocketMap[userId] = socket.id;  
      console.log(`User registered: ${userId} with socket ID: ${socket.id}`);  
    });  

    socket.on('chatmessage', async (sender, reciever, message) => {  
      const sid = sender._id.toString();  
      const rid = reciever._id.toString();  
      const chatId = sid < rid ? `${sid}-${rid}` : `${rid}-${sid}`;  
      
      socket.join(chatId);  

      const existing = await Chats.findOne({ chatId });  
      if (existing !== null) {  
        const res = await Chats.findByIdAndUpdate(  
          existing._id,  
          { $push: { chat: { sender: sender.name, reciever: reciever.name, message: message, sentTime: new Date() } } },  
          { new: true }  
        );  
        io.to(chatId).emit('message', { chat: res.chat });  
        return;  
      }  

      const chat = new Chats({  
        chatId,  
        chat: [{ sender: sender.name, reciever: reciever.name, message: message, sentTime: new Date() }],  
      });  

      try {  
        const res = await chat.save();  
        io.to(chatId).emit('message', { chat: res.chat });  
      } catch (error) {  
        console.log({ message: 'Failed to save chat', error });  
      }  
    });  

    socket.on('disconnect', () => {  
      console.log(`Client disconnected: ${socket.id}`);  
      Object.keys(userToSocketMap).forEach((userId) => {  
        if (userToSocketMap[userId] === socket.id) {  
          delete userToSocketMap[userId];  
        }  
      });  
    });  
  });  
};  

module.exports = socketHandler;