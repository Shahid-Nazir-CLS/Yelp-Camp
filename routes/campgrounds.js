const express = require('express');
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");


// INDEX ROUTE -- SHOW ALL CAMPGROUNDS
router.get("/", catchAsync(async (req, res) => {
	const campgrounds = await Campground.find({});
	res.render("campgrounds/index", {campgrounds : campgrounds});
}))


// NEW ROUTE -- SHOW FORM TO CREATE NEW CAMPGROUNDS
router.get("/new", isLoggedIn, (req, res) => {	
	res.render("campgrounds/new");
})


// CREATE ROUTE -- ADD NEW CAMPGROUND
router.post("/", isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
	req.body.campground.author = req.user._id;
	const campground = await Campground.create({...req.body.campground});
	req.flash('success', 'Successfully added new campground.')
	res.redirect(`/campgrounds/${campground._id}`);
}));


// SHOW ROUTE -- show info about a campground
router.get("/:id", catchAsync(async (req, res) => {
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
}));


// Edit Route
router.get("/:id/edit", isLoggedIn,isAuthor ,catchAsync(async (req, res) => {
	const campground = await Campground.findById(req.params.id);
	if(!campground){
		req.flash('error', "Campground not found.");
		res.redirect("/campgrounds");
	}
	res.render("campgrounds/edit", {campground : campground});
	
}));


// Update Route
router.put("/:id", isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) =>{
	const { id } = req.params;
	const campground = await (await Campground.findById(id)).populate('author');
	
	await Campground.findByIdAndUpdate(id, {... req.body.campground}, {new: true});
	req.flash('success', 'Successfully updated the campground.');
	res.redirect("/campgrounds/" + id);	
}));


// Destroy Route
router.delete("/:id", isLoggedIn, isAuthor, catchAsync(async (req, res) =>{
	await Campground.findByIdAndDelete(req.params.id);
	req.flash('success', 'Successfully deleted the campground.')
	res.redirect("/campgrounds");
}));


module.exports = router;