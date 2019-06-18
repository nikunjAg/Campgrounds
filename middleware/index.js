const {Campground}  = require('../models/Campground'),
      {Comment}     = require('../models/Comment');

var middlewareObj = {};

middlewareObj.isLoggedIn = function (req, res, next) {
    if ( req.isAuthenticated() ) {
        return next();
    }
    req.flash('error', 'You need to be Logged In.');
    res.redirect('/login');
}

middlewareObj.checkCampgroundOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, campground) => {
            if ( err ) {
                req.flash('error', 'Campground not found.');
                return res.redirect("/campground/<%= req.params.id %>");
            }

            // Is Authorized
            // Because the campground.author.id is an ObjectId and req.user._id is an String
            if ( campground.author.id.equals(req.user._id) ) {
                next();
            } else {
                req.flash('error', 'You are not Authorized to Edit this Campground.');
                res.redirect("/campgrounds/" + campground._id);
            }
        });
    } else {
        req.flash('error', 'You need to be Logged In.');
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.commentId, ( err, comment ) => {
            if ( err ) {
                req.flash('error', 'No Such Comment Found.');
                return res.redirect('back');
            }

            if ( comment.author.id.equals( req.user._id ) ) {
                next();
            } else {
                req.flash('error', 'You are not Authorized to Edit this Comment.');
                res.redirect( `/campgrounds/${req.params.id}` );
            }
        });
    } else {
        req.flash('error', 'You need to be Logged In.');
        res.redirect( 'back' );
    }
}

module.exports = middlewareObj;