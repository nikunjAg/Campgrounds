// Modules
const express      = require('express'),
      passport     = require('passport');

// Express Router
const router       = express.Router();

// Models and Middleware
const {User}       = require('../models/User');
const {isLoggedIn} = require('../middleware');

router.get('/', (req, res)=> {
    res.render('landing');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', (req, res) => {

    User.findOne({ username: req.body.username }, (err, user) => {
        if (err) {
            req.flash('error', 'Some Error Ocurred');
            return res.redirect('/register');
        }
        if ( !user ) {
            User.register(new User({ username: req.body.username }), req.body.password, function(err, user) {
                if (err) {
                    req.flash('error', 'Some Error Ocurred');
                    return res.redirect('/register');
                } else {
                    // User now have signed up
                    // Now logging him in
                    passport.authenticate('local')(req, res, function (){
                        req.flash("success", "Welcome To YelpCamp " + user.username);
                        return res.redirect('/campgrounds');
                    });
                }
            });
        }
        if ( user ) {
            req.flash("error", "This username already exists.");
            return res.redirect('/register');
        }
    });

});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', passport.authenticate('local', {
        successRedirect: '/campgrounds',
        failureRedirect: '/login',
        failureFlash: true,
        successFlash: true
    }), (req, res) => {
});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash("success", "You are logged Out!");
    res.redirect('/');
});

module.exports = { router, isLoggedIn };