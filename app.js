if(process.env.NODE_ENV !== "production"){
	require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError");
const campgroundRoutes = require("./routes/campgrounds");
const userRoutes = require("./routes/users");
const reviewRoutes = require("./routes/reviews");
const session = require("express-session");
const flash = require("connect-flash");
const path = require('path');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const helmet = require("helmet"); 
const dbUrl = process.env.DB_URL || "mongodb://localhost/yelp_camp"; 

const MongoDBStore = require("connect-mongo");


mongoose.connect(dbUrl)
.then(() => {console.log("Mongoose Connection Open")})
.catch(err => {console.log(err);});

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));	
app.use(express.static(path.join(__dirname, 'public')));


const sessionConfig = {
	store: MongoDBStore.create({
		mongoUrl: dbUrl,
		secret: process.env.SESSION_SECRET,
		touchAfter: 24 * 3600
	}),
	name: 'session',
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7, 
		maxAge:  1000 * 60 * 60 * 24 * 7 
	}
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
    next();
})



const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];


const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
	"https://cdn.jsdelivr.net/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/de806oapq/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://source.unsplash.com/collection/483251",
				"https://images.unsplash.com/"
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);



app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

// Home Route
app.get("/", (req, res) => {
	res.render("landing");
})

// Any other undefined page or route
app.all('*', (req, res, next) => {
	next(new ExpressError('Page Not Found', 404));
});

// Error Handler
app.use((err, req, res, next) => {
	const {message = 'Something went wrong', statusCode = 500} = err;
	if(!err.message)
	err.message = 'Something went Wrong!!!'
	res.status(statusCode).render('error', { err }); 
});

// start server
app.listen(3000, () =>{
	console.log('Server started');
})