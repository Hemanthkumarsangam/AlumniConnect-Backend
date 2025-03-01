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
        defaultValue: 0,
    },
    likedUsers: { 
        type: [String], 
        default: [] 
    },
    comments: { type: [{ user: String, userImage: String, comment: String }], default: [] },
    authorImage : {
        type: 'string',
        required: true
    },
    date: {
        type: 'Date',
        required: true
    }
})

const Posts = mongoose.model('Posts', postSchema)
module.exports = Posts