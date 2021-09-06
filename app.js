const app  = require("express")(),
bodyParser = require("body-parser"),
mongoose   = require("mongoose"),
ejsMate    = require("ejs-mate");
Campground = require("./models/campground")

mongoose.connect("mongodb://localhost/yelp_camp")
.then(() => {console.log("Mongoose Connection Open")})
.catch(err => {console.log(err);});

app.engine("ejs", ejsMate);
app.use(bodyParser.urlencoded({ extended: true }));
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
	const name = req.body.name;
	const image = req.body.image;
	const description = req.body.description;
	await Campground.create(
		{
			name : name,
			image : image,
			description : description
		})
		console.log("Campground added");	
		res.redirect("/campgrounds");
	});
	
	// SHOW ROUTE -- show info about a campground
	app.get("/campgrounds/:id", async (req, res) => {
		const id = req.params.id;
		const campground = await Campground.findById(id);
		res.render("show.ejs", {campground : campground});
	});
	
	
	app.listen(3000, () =>{
		console.log('Server started');
	})