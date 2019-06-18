// Modules
const express                                 = require('express');

// Express Router
const router                                  = express.Router();

// Models and Middleware Methods
const {Campground}                            = require('../models/Campground'),
      {isLoggedIn, checkCampgroundOwnership}  = require('../middleware');



// Show All The Campgrounds
router.get('/', (req, res)=> {
    Campground.find({}, function(err, campgrounds) {
        if(err) {
            req.flash('error', 'Some Database Error Ocurred.');
            return res.redirect('back');
        }
        return res.render('campgrounds/index', { campgrounds });
    });
});

// Create a new Campground
router.post('/', isLoggedIn, (req, res) => {
    var name = req.body.title;
    var image = req.body.image;
    var caption = req.body.caption;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    if(name != undefined && image != undefined && caption != undefined ){
        Campground.create({ name, image, caption, author }, function(err, result) {
                if(err) {
                    req.flash('error', 'Unable to create such Campground.');
                    return res.redirect('back');
                }
                req.flash('success', 'Successfully Created The new Campground.');
                return res.redirect('/campgrounds');
            }
        );
    }
});

// If placed below /campgrounds/:id route it won't be called
// Show the new Campground Form
router.get('/new', isLoggedIn, (req, res)=> {
    res.render('campgrounds/new');
});

// Show a campground with its ID
router.get('/:id', (req, res)=> {
    Campground.findById(req.params.id).populate('comments').exec(function(err, campground) {
        if ( err || !campground ) {
            req.flash('error', 'Unable to find such Campground.');
            return res.redirect('/campgrounds');
        }
        return res.render('campgrounds/show', { campground });
    });
});

// Edit a Campground
router.get('/:id/edit', checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            req.flash('error', 'Unable to find such Campground.');
            return res.redirect('/campgrounds/' + req.params.id);
        }
        return res.render('campgrounds/edit', { campground });
    });
});

// Update The Campground
router.put('/:id', checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, {
        $set: {
            name: req.body.name,
            image: req.body.image,
            caption: req.body.caption
        }
    }, (err, campground) => {
        if (err) {
            req.flash('error', 'Unable to update the Campground.');
            return res.redirect('/campgrounds/' + req.params.id);
        }
        req.flash('success', 'Successfully Updated The Campground.');
        res.redirect('/campgrounds/' + req.params.id);
    });
});

// Delete a Campground
router.delete('/:id', checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndDelete(req.params.id, (err, campground) => {
        if (err) {
            req.flash('error', 'Unable to delete such Campground.');
            return res.redirect('/campgrounds/' + req.params.id);
        }
        req.flash('success', 'Deleted The Campground Successfully.');
        return res.redirect('/campgrounds');
    });
});

module.exports = { router };