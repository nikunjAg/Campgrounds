// Modules
const express                               = require('express');

// Express Router
const router                                = express.Router({ mergeParams: true });

// Models and Middleware Methods
const {Campground}                          = require('../models/Campground'),
      {Comment}                             = require('../models/Comment'),
      {isLoggedIn, checkCommentOwnership}   = require('../middleware');


// Send the new Comment Form
router.get('/new', isLoggedIn, (req, res) => {
    res.render('comments/new', { campgroundId: req.params.id });
});

// Create the Comment in the Database
router.post('/', isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, function(err, campground){
        if (err) {
            req.flash('error', 'Unable to find such Campground.');
            return res.redirect('/campgrounds');
        }
        Comment.create(
            {
                text: req.body.comment.text,
                author: {
                    id: req.user._id,
                    username: req.user.username
                }
            }, function (err, comment) {
            if (err) {
                req.flash('error', 'Unable to create such Comment.');
                return res.redirect('/campgrounds/' + req.params.id);
            }
            campground.comments.push(comment._id);
            campground.save(function(err, result) {
                if (err) {
                    req.flash('error', 'Some Error Ocurred');
                    return res.redirect('/campgrounds/' + req.params.id);
                }
                req.flash('success', 'Posted the Comment');
                return res.redirect(`/campgrounds/${req.params.id}`);
            });
        });
    });
});

// Form For Existing Editing Comment
router.get('/:commentId/edit', checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.commentId, (err, comment) => {
        if (err) {
            req.flash('error', 'Unable to find such Comment.');
            return res.redirect('/campgrounds/' + req.params.id);
        }
        return res.render('comments/edit', { comment, campgroundId: req.params.id });
    });
});

// Update the comment in database
router.put('/:commentId', checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.commentId, {
        $set: {
            text: req.body.comment
        }
    }, (err, comment) => {
        if (err) {
            req.flash('error', 'Unable to create such Comment.');
            return res.redirect('/campgrounds/' + req.params.id);
        }
        req.flash('success', 'Updated the Comment Successfully.');
        res.redirect('/campgrounds/' + req.params.id);
    });
});

// Delete the comment
router.delete('/:commentId', checkCommentOwnership, (req, res) => {
    Comment.findByIdAndDelete(req.params.commentId, (err, comment) => {
        if (err) {
            req.flash('error', 'Unable to delete such Comment.');
            return res.redirect('/campgrounds/' + req.params.id);
        }
        req.flash('success', 'Deleted The comment Successfully.');
        return res.redirect('/campgrounds/' + req.params.id);
    });
});


module.exports = { router };