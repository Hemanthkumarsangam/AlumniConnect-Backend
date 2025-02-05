const mongoose = require('mongoose')
const postSchema = mongoose.Schema({
    author: {
        type: 'string',
        required: true
    },
    description: {
        type: 'string',
        required: true
    },
    imageUrl: {
        type: 'string'
    },
    likes: {
        type: 'number',
        defaultValue: 0
    },
    comments: {
        type: [{
            author: {
                type: 'string'
            },
            comment: {
                type: 'string'
            }
        }]
    }
})