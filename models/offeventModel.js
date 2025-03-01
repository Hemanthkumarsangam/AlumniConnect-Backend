const mongoose = require('mongoose');
const offeventSchema = mongoose.Schema({
    title : {
        type : 'string',
        required : true,
    },
    description : {
        type : 'string',
        required : true,
    },
    date : {
        type : 'Date',
        required : true,
    },
    coordinator : {
        type : {
            name : {
                type : 'string',
                required : true,
            },
            phone : {
                type : 'string',
                required : true,
            },
            email : {
                type : 'string',
                required : true,
            },
        },
        required : true,
    },
    location : {
        type : 'string',
        required : true,
    },
    images : {
        type : ['string'],
    },
    activities : {
        type:['string'],
        required : true,
    },
    time : {
        type : 'string',
        required : true,
    },
    speaker: {
        type: 'string',
    },
    feedback: {
        type: 'string',
        required: true,
        defaultValue: '',
    }
})

const OffEvents = new mongoose.model('OffEvents', offeventSchema);
module.exports = OffEvents;