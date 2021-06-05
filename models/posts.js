//first name, last name, email, username, password, deleted(true or false), admin
var mongoose = require('mongoose');

var postsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    published: {
        type: Boolean,
        default: false
    }
    
});

var Post = mongoose.model('posts', postsSchema);

module.exports = Post