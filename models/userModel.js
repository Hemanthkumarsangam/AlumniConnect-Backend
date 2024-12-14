const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name : {
        type : 'string',
        required : true,
    },
    email : {
        type : 'string',
        required : true,
        unique : [true, 'user already exists'],
    },
    password : {
        required : true,
        type : 'string',
    },
    regId : {
        type : 'string', 
        required : true,
    },
    role : {
        type : 'string',
        enum : ['student, admin, alumni, staff'],
        default : 'student',
        required : true,
    }
})

const User = new mongoose.model('Users', userSchema);
module.exports = User; 