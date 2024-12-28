const path = require('path');
const cors = require('cors');
const http = require('http');
const dotenv = require('dotenv'); 
const express = require('express');
const connectDB = require('./dbConnect');
const socketHandler = require('./socket');
const jobApp = require('./routes/jobRoutes');
const userApp = require('./routes/userRoutes');
const eventApp = require('./routes/eventRoutes');
const offEventApp = require('./routes/offeventsRoutes'); 
const updtChat = require('./routes/chatRoutes');
const app = express();

dotenv.config()
app.use(cors())
app.use(express.json())
connectDB()

app.use('/user', userApp)
app.use('/event', eventApp)
app.use('/offEvent', offEventApp)
app.use('/jobs', jobApp)
app.use('/chat', updtChat)
app.use('/uploads', express.static(path.join(__dirname, 'profilepics')))

const server = http.createServer(app)
socketHandler(server)

server.listen(7000, () => {
  console.log(`server started successfully`)
})