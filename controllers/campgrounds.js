const Campground = require("../models/campground")

module.exports.index = async (req, res) => {
	const campgrounds = await Campground.find({});
	res.render("campgrounds/index", {campgrounds : campgrounds});
};

module.exports.renderForm = (req, res) => {	
	res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res, next) => {
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
	const campground = await (await Campground.findById(id)).populate('author');
	
	await Campground.findByIdAndUpdate(id, {... req.body.campground}, {new: true});
	req.flash('success', 'Successfully updated the campground.');
	res.redirect("/campgrounds/" + id);	
};

module.exports.deleteCampground = async (req, res) =>{
	await Campground.findByIdAndDelete(req.params.id);
	req.flash('success', 'Successfully deleted the campground.')
	res.redirect("/campgrounds");
};