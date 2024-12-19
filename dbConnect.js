const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log(`DB connection established`)
    } catch (error) {
        console.error(`Error connecting to DB: ${error.message}`)
        process.exit(1)
    }
}

module.exports = connectDB