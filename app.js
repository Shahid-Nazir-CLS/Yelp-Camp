const express    	 = require("express"),
mongoose         	 = require("mongoose"),
ejsMate          	 = require("ejs-mate"),
Campground       	 = require("./models/campground"),
Review       	 	 = require("./models/reviews"),
methodOverride   	 = require("method-override"),
catchAsync       	 = require("./utils/catchAsync"),
ExpressError     	 = require("./utils/ExpressError"),
{ campgroundSchema } = require("./joiSchemas"),
Joi                  = require('joi');

const app = express();

mongoose.connect("mongodb://localhost/yelp_camp")
.then(() => {console.log("Mongoose Connection Open")})
.catch(err => {console.log(err);});

app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));	
app.set("view engine", "ejs");


// Home Route
app.get("/", (req, res) => {
	res.render("landing");
})


// INDEX ROUTE -- SHOW ALL CAMPGROUNDS
app.get("/campgrounds", catchAsync(async (req, res) => {
	const campgrounds = await Campground.find({});
	res.render("campgrounds/index", {campgrounds : campgrounds});
}))


// NEW ROUTE -- SHOW FORM TO CREATE NEW CAMPGROUNDS
app.get("/campgrounds/new", (req, res) => {
	res.render("campgrounds/new");
})

const validateCampground = (req, res, next) =>{

	const { error } = campgroundSchema.validate(req.body);
	
	if(error){
		const msg = error.details.map(el => el.message).join(',')
		throw new ExpressError(msg, 400);
	}else{
		next();
	}
}

// CREATE ROUTE -- ADD NEW CAMPGROUND
app.post("/campgrounds", validateCampground, catchAsync(async (req, res, next) => {
	const campground = await Campground.create({...req.body.campground});
	console.log("Campground added");	
	res.redirect(`/campgrounds/${campground._id}`);
}));



// SHOW ROUTE -- show info about a campground
app.get("/campgrounds/:id", catchAsync(async (req, res) => {
	const id = req.params.id;
	const campground = await Campground.findById(id).populate('reviews');
	res.render("campgrounds/show", {campground : campground});
}));


// Edit Route
app.get("/campgrounds/:id/edit", catchAsync(async (req, res) => {
	const campground = await Campground.findById(req.params.id);
	res.render("campgrounds/edit", {campground : campground});
}));

// Update Route
app.put("/campgrounds/:id", validateCampground, catchAsync(async (req, res) =>{
	const { id } = req.params;
	await Campground.findByIdAndUpdate(id, {... req.body.campground}, {new: true});
	res.redirect("/campgrounds/" + id);
}));

// Destroy Route
app.delete("/campgrounds/:id", catchAsync(async (req, res) =>{
	await Campground.findByIdAndDelete(req.params.id);
	res.redirect("/campgrounds");
}));

app.delete("/campgrounds/:campgroundID/reviews/:reviewID", catchAsync(async (req, res) =>{
	const { campgroundID, reviewID } = req.params;
	
	await Campground.findByIdAndUpdate(campgroundID, { $pull: {reviews: reviewID}});
	
	await Review.findByIdAndRemove(reviewID);
	
	res.redirect(`/campgrounds/${req.params.campgroundID}`);
}));

// reviews post
app.post("/campgrounds/:id/reviews", catchAsync(async (req, res) => {
	const campground = await Campground.findById(req.params.id);
	const review = new Review(req.body.review);
	
	campground.reviews.push(review);
	
	await review.save();
	await campground.save();
	
	res.redirect(`/campgrounds/${campground._id}`);
	
}));


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

app.listen(3000, () =>{
	console.log('Server started');
})