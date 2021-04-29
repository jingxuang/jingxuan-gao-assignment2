const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    comment: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

const postSchema = new Schema({
    title: {
        type: String, 
        required: true
    },
    content: {
        type: String,
        required: true
    },
    isText: { // 0 for text post, 1 for url post
        type: Boolean,
        default: 0
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [ commentSchema ]
}, {
    timestamps: true
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;