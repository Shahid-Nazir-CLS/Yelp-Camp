const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const Review = require("../models/reviews");


// reviews post
router.post("/", catchAsync(async (req, res) => {
	const campground = await Campground.findById(req.params.id);
	const review = new Review(req.body.review);
	campground.reviews.push(review);
	await review.save();
	await campground.save();
	req.flash('success', 'Successfully added the review.')
	res.redirect(`/campgrounds/${campground._id}`);
}));

// delete review
router.delete("/:reviewID", catchAsync(async (req, res) =>{
	const { id, reviewID } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: {reviews: reviewID}});
	await Review.findByIdAndRemove(reviewID);
	req.flash('success', 'Successfully deleted the review.')
	res.redirect(`/campgrounds/${id}`);
}));


module.exports = router;