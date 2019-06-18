// Modules
const express              = require('express'),
    bodyParser             = require('body-parser'),
    mongoose               = require('mongoose'),
    passport               = require('passport'),
    LocalStrategy          = require('passport-local'),
    session                = require('express-session'),
    flash                  = require('connect-flash'),
    methodOverride         = require('method-override'),
    moment                 = require('moment'),
    join                   = require('path').join;


// Models
const seedDb                 = require('./seeds'),
      {Campground}           = require('./models/Campground'),
      {Comment}              = require('./models/Comment'),
      {User}                 = require('./models/User');


// Routes
const campgroundRouter = require('./routes/campground').router,
      commentRouter    = require('./routes/comment').router,
      indexRouter      = require('./routes/index').router;


// App Config
var app = express();
var PORT = process.env.PORT || 3000;

// Database Setup
mongoose.connect(
    'mongodb://localhost/yelpcamp',
    {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true
    }
);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error:'));
db.once('open', ()=> {
    console.log('Connected');

    // Seed Database
    seedDb();

    // Middleware
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.static(join(__dirname, 'public')));
    app.set('view engine', 'ejs');
    // Allow support to handle the put, delete request -> (Comes After BodyParser)
    app.use(methodOverride('_method'));
    // Allow us do handle the error and also display it to user -> (Comes before Passport)
    app.use(flash());

    // Express Sessions
    app.use(session({
        secret: 'My Secret!',
        resave: false,
        saveUninitialized: false
    }));

    // Passport Setup
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    // Middleware to get the CurrentUser in each route
    app.use((req, res, next) => {
        res.locals.currentUser = req.user;
        res.locals.moment = moment;
        res.locals.errorMessages = req.flash("error");
        res.locals.successMessages = req.flash("success");
        next();
    });

    // Serve up the Routes
    app.use('/', indexRouter);
    app.use('/campgrounds', campgroundRouter);
    app.use('/campgrounds/:id/comments', commentRouter);

    // App Listen PORT
    app.listen(PORT, ()=> console.log(`App started on PORT ${PORT}`));

});