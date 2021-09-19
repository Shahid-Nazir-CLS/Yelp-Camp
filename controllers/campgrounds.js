const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary");
const mbxGeoCoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeoCoding({ accessToken: mapBoxToken })

module.exports.index = async (req, res) => {
	const campgrounds = await Campground.find({});
	res.render("campgrounds/index", {campgrounds : campgrounds});
};

module.exports.renderForm = (req, res) => {	
	res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res, next) => {
	
	const geoData = await geocoder.forwardGeocode({
		query: req.body.campground.location,
		limit: 1
	}).send();
	
	req.body.campground.geometry = geoData.body.features[0].geometry;
	req.body.campground.images = req.files.map(file => ({ url: file.path, filename: file.filename}))
	req.body.campground.author = req.user._id;
	const campground = await Campground.create({...req.body.campground});
	req.flash('success', 'Successfully added new campground.')
	res.redirect(`/campgrounds/${campground._id}`);
};





module.exports.showCampground = async (req, res) => {
	const id = req.params.id;
	const campground = await Campground.findById(id).populate({
		path:'reviews',
		populate: {
			path:'author'
		}	
	}).populate('author');
	
	if(!campground){
		req.flash('error', "Campground not found.");
		res.redirect("/campgrounds");
	}
	res.render("campgrounds/show", {campground : campground});
};

module.exports.renderEditForm = async (req, res) => {
	const campground = await Campground.findById(req.params.id);
	if(!campground){
		req.flash('error', "Campground not found.");
		res.redirect("/campgrounds");
	}
	res.render("campgrounds/edit", {campground : campground});
	
};



module.exports.editCampground = async (req, res) =>{
	const { id } = req.params;
	const campground = await Campground.findByIdAndUpdate(id, {... req.body.campground}, {new: true});
	const imgs = req.files.map(file => ({ url: file.path, filename: file.filename}));
	campground.images.push(...imgs);
	await campground.save();
	
	if(req.body.deleteImages){
		for(let filename of req.body.deleteImages){
			await cloudinary.uploader.destroy(filename);
		}
		await campground.updateOne( { $pull : { images : { filename : { $in : req.body.deleteImages} } } } );
	}
	
	req.flash('success', 'Successfully updated the campgsround.');
	res.redirect("/campgrounds/" + id);	
};

module.exports.deleteCampground = async (req, res) =>{
	await Campground.findByIdAndDelete(req.params.id);
	req.flash('success', 'Successfully deleted the campground.')
	res.redirect("/campgrounds");
};