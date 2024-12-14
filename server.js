const express = require('express');
const dotenv = require('dotenv');
const http = require('http');
const connectDB = require('./dbConnect');
const userApp = require('./routes/userRoutes');
const eventApp = require('./routes/eventRoutes');
const socketHandler = require('./socket');  
const app = express();
const cors = require('cors')

dotenv.config()
app.use(cors())
app.use(express.json())
connectDB()

app.use('/user', userApp)
app.use('/event', eventApp)

const server = http.createServer(app)
socketHandler(server)

server.listen(7000, () => {
  console.log(`server started successfully`)
})