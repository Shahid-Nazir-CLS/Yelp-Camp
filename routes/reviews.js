const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isReviewAuthor } = require("../middleware")
const reviews = require("../controllers/reviews")

// reviews post
router.post("/", isLoggedIn, catchAsync(reviews.createReview));

// delete review
router.delete("/:reviewID", isReviewAuthor,  isLoggedIn, catchAsync(reviews.deleteReview));

module.exports = router;