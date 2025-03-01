const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    type : {
        type : 'string',
        required : true,
        enum : ['Webinar', 'QA', 'Mock Interview', 'Workshop'],
    },
    title : {
        type: 'string',
        required : true
    },
    hostName : {
        type : 'string',
        required : true,
    },
    createdAt : {
        type : 'Date',
        default : Date.now(),
        required : true,
    },
    scheduledAt : {
        type : 'Date',
        required : true,
    },
    period : {
        type : 'string',
        required : true,
    },
    description : {
        type : 'string',
        required : true,
    },
    status : {
        type : 'string',
        required : true,
        default : 'upcoming',
    },
    sessionId : {
        type : 'string',
    }
})

const Events = new mongoose.model('Events', eventSchema);
module.exports = Events; 