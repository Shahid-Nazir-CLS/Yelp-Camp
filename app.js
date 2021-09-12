const express    	 = require("express"),
app  				 = express(),
mongoose         	 = require("mongoose"),
ejsMate          	 = require("ejs-mate"),
methodOverride   	 = require("method-override"),
ExpressError     	 = require("./utils/ExpressError"),
campgroundRoutes     = require("./routes/campgrounds"),
reviewRoutes         = require("./routes/reviews"),
session				 = require("express-session"),
flash  				 = require("connect-flash");

mongoose.connect("mongodb://localhost/yelp_camp")
.then(() => {console.log("Mongoose Connection Open")})
.catch(err => {console.log(err);});

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));	
app.use(express.static('public'))

const sessionConfig = {
	secret: 'mySecretKey',
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

app.use((req, res, next) => {
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
    next();

})



app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);


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