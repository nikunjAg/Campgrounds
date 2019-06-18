const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var campgroundSchema = new Schema({
    name: String,
    image: String,
    caption: String,
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    }
});

var Campground = mongoose.model('campground', campgroundSchema);

module.exports = { Campground };