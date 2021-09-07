const express    = require("express"),
mongoose         = require("mongoose"),
ejsMate          = require("ejs-mate"),
Campground       = require("./models/campground"),
methodOverride   = require("method-override");

const app = express();

mongoose.connect("mongodb://localhost/yelp_camp")
.then(() => {console.log("Mongoose Connection Open")})
.catch(err => {console.log(err);});

app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));	
app.set("view engine", "ejs");


// SCHEMA SETUP
app.get("/", (req, res) => {
	res.render("landing");
})


// INDEX ROUTE -- SHOW ALL CAMPGROUNDS

app.get("/campgrounds", async (req, res) => {
	const campgrounds = await Campground.find({});
	res.render("campgrounds", {campgrounds : campgrounds});
})


// NEW ROUTE -- SHOW FORM TO CREATE NEW CAMPGROUNDS

app.get("/campgrounds/new", (req, res) => {
	res.render("new.ejs");
})


// CREATE ROUTE -- ADD NEW CAMPGROUND

app.post("/campgrounds", async (req, res) => {
	await Campground.create({...req.body.campground});
		console.log("Campground added");	
		res.redirect("/campgrounds");
	});
	
	// SHOW ROUTE -- show info about a campground
	app.get("/campgrounds/:id", async (req, res) => {
		const id = req.params.id;
		const campground = await Campground.findById(id);
		res.render("show.ejs", {campground : campground});
	});
	
	
	// Edit Route
	app.get("/campgrounds/:id/edit", async (req, res) => {
		const campground = await Campground.findById(req.params.id);
		res.render("edit", {campground : campground});
	});
	
	// Update Route
	app.put("/campgrounds/:id", async (req, res) =>{
		const { id } = req.params;
		await Campground.findByIdAndUpdate(id, {... req.body.campground}, {new: true});
		res.redirect("/campgrounds/" + id);
	});

	// Destroy Route
	app.delete("/campgrounds/:id", async (req, res) =>{
		await Campground.findByIdAndRemove(req.params.id);
		res.redirect("/campgrounds");
	});
	
	app.listen(3000, () =>{
		console.log('Server started');
	})