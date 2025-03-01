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
    experience: {
        type: String,
        required: true
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
        default : false,
        required: true
    },
    jobType : {
        type : 'string',
        required: true,
        enum : ['Full-time', 'Part Time', 'Internship', 'Internship + PPO']
    }
})

const Jobs = new mongoose.model('Jobs', jobSchema);
module.exports = Jobs;