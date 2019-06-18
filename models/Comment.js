var mongoose = require('mongoose');

// Comments Schema
var commentSchema = new mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

// Comments Model
var Comment = mongoose.model("Comment", commentSchema);
module.exports = { Comment };