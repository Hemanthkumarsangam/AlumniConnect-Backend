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
    username : {
        type : 'string',
        required : true,
        unique : [true, 'username already exists'],
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
    },
    imageUrl : {
        type : 'string',
        required : true,
    },
    company : {
        type : 'string',
    },
    designation : {
        type : 'string',
    }
})

const User = new mongoose.model('Users', userSchema);
module.exports = User; 