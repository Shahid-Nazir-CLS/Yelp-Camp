const express = require('express');
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const { campgroundSchema } = require("../joiSchemas");


const validateCampground = (req, res, next) =>{
	const { error } = campgroundSchema.validate(req.body);
	if(error){
		const msg = error.details.map(el => el.message).join(',')
		throw new ExpressError(msg, 400);
	}else{
		next();
	}
}


// INDEX ROUTE -- SHOW ALL CAMPGROUNDS
router.get("/", catchAsync(async (req, res) => {
	const campgrounds = await Campground.find({});
	res.render("campgrounds/index", {campgrounds : campgrounds});
}))


// NEW ROUTE -- SHOW FORM TO CREATE NEW CAMPGROUNDS
router.get("/new", (req, res) => {
	res.render("campgrounds/new");
})


// CREATE ROUTE -- ADD NEW CAMPGROUND
router.post("/", validateCampground, catchAsync(async (req, res, next) => {
	const campground = await Campground.create({...req.body.campground});
	req.flash('success', 'Successfully added new campground.')
	res.redirect(`/campgrounds/${campground._id}`);
}));


// SHOW ROUTE -- show info about a campground
router.get("/:id", catchAsync(async (req, res) => {
	const id = req.params.id;
	const campground = await Campground.findById(id).populate('reviews');
	if(!campground){
		req.flash('error', "Campground not found.");
		res.redirect("/campgrounds");
	}
	res.render("campgrounds/show", {campground : campground});
}));


// Edit Route
router.get("/:id/edit", catchAsync(async (req, res) => {
	const campground = await Campground.findById(req.params.id);
	if(!campground){
		req.flash('error', "Campground not found.");
		res.redirect("/campgrounds");
	}
	res.render("campgrounds/edit", {campground : campground});
}));


// Update Route
router.put("/:id", validateCampground, catchAsync(async (req, res) =>{
	const { id } = req.params;
	await Campground.findByIdAndUpdate(id, {... req.body.campground}, {new: true});
	req.flash('success', 'Successfully updated the campground.')
	res.redirect("/campgrounds/" + id);
}));


// Destroy Route
router.delete("/:id", catchAsync(async (req, res) =>{
	await Campground.findByIdAndDelete(req.params.id);
	req.flash('success', 'Successfully deleted the campground.')
	res.redirect("/campgrounds");
}));


module.exports = router;