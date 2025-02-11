const mongoose  = require('mongoose');
const jobSchema = new mongoose.Schema({
    company : {
        type: String,
        required: true
    },
    role : {
        type: String,
        required: true
    },
    location : {
        type: String,
        required: true
    },
    salaryRange : {
        from : {
            type: Number,
            required: true
        },
        to : {
            type: Number,
            required: true
        }
    },
    experienceRange : {
        from : {
            type: Number,
            required: true
        },
        to : {
            type: Number,
            required: true
        }
    },
    applyLink : {
        type : 'string',
        required: true
    },
    applyBefore : {
        type : 'Date',
        required: true
    },
    description : {
        type : 'string',
        required: true
    },
    skills : {
        type : [],
        required: true
    },
    isApplied : {
        type : 'boolean',
        default : false
    },
    jobType : {
        type : 'string',
        required: true,
        enum : ['Full Time', 'Part Time', 'Internship']
    }
})

const Jobs = new mongoose.model('Jobs', jobSchema);
module.exports = Jobs;