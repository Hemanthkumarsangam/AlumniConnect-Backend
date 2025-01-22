const mongoose = require('mongoose');
const offeventSchema = mongoose.Schema({
    title : {
        type : 'string',
        required : true,
    },
    mode : {
        type : 'string',
        required : true,
        enum : ['Online', 'Offline'],
    },
    description : {
        type : 'string',
        required : true,
    },
    date : {
        type : 'Date',
        required : true,
    },
    duration : {
        type : 'number',
        required : true,
    },
    coordinators : {
        type : [{
            name : {
                type : 'string',
                required : true,
            },
            contact : {
                type : 'string',
                required : true,
            },
            email : {
                type : 'string',
                required : true,
            },
        }],
        required : true,
    },
    venue : {
        type : 'string',
        required : true,
    },
    images : {
        type : [],
        required : true,
    },
    activities : {
        type : [],
        required : true,
    }
})

const OffEvents = new mongoose.model('OffEvents', offeventSchema);
module.exports = OffEvents;